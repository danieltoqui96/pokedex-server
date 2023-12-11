import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Conexión a la base de datos
async function connect(collection) {
  await client.connect();
  const db = client.db('pokemondb').collection(collection);
  return { db, close: () => client.close() };
}

export class AbilityModel {
  // Obtener todas las habilidades
  static async getAll({ nombre }) {
    let query = {};
    if (nombre)
      query.$or = [
        { 'name.spanish': { $regex: new RegExp(`${nombre}`, 'i') } },
        { 'name.english': { $regex: new RegExp(`${nombre}`, 'i') } },
      ];
    const { db, close } = await connect('abilities');
    const abilities = await db
      .find(query)
      .sort({ 'name.spanish': 1 })
      .toArray();
    await close();
    return abilities;
  }

  // Obtener una habilidad por ID
  static async getById({ id }) {
    const { db, close } = await connect('abilities');
    const ability = await db.findOne({ _id: new ObjectId(id) });
    await close();
    if (!ability) throw new Error('NOT_FOUND');
    return ability;
  }

  // Crear una nueva habilidad
  static async create({ input }) {
    input.lastModified = new Date().toLocaleString();
    const { db, close } = await connect('abilities');
    const { insertedId } = await db.insertOne(input);
    await close();
    return { _id: insertedId, ...input };
  }

  // Eliminar una habilidad
  static async delete({ id }) {
    const { db: pokemonDb, close: closePokemonDb } = await connect('pokemon');
    const allPokemon = await pokemonDb
      .find({
        $or: [
          { 'abilities.normal._id': new ObjectId(id) },
          { 'abilities.hidden._id': new ObjectId(id) },
        ],
      })
      .toArray();
    await closePokemonDb();

    if (allPokemon.length > 0)
      throw {
        message: 'ABILITY_IN_USE',
        pokemon: allPokemon.map((pokemon) => pokemon.name),
      };
    const { db, close } = await connect('abilities');
    const { deletedCount } = await db.deleteOne({ _id: new ObjectId(id) });
    await close();
    if (deletedCount === 0) throw new Error('NOT_FOUND');
  }

  // Actualizar una habilidad
  static async update({ id, input }) {
    input.lastModified = new Date().toLocaleString();
    const { db: abilitiesDb, close: closeAbilitiesDb } = await connect(
      'abilities'
    );
    const updatedAbility = await abilitiesDb.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    await closeAbilitiesDb();
    if (!updatedAbility) throw new Error('NOT_FOUND');
    delete updatedAbility.lastModified;

    const { db: pokemonDb, close: closePokemonDb } = await connect('pokemon');
    const allPokemon = await pokemonDb
      .find({
        $or: [
          { 'abilities.normal._id': new ObjectId(id) },
          { 'abilities.hidden._id': new ObjectId(id) },
        ],
      })
      .toArray();

    const bulkUpdate = await Promise.all(
      allPokemon.map(async (pokemon) => {
        pokemon.abilities.normal = pokemon.abilities.normal.map((ability) =>
          ability._id.toString() === id ? updatedAbility : ability
        );
        if (
          pokemon.abilities.hidden &&
          pokemon.abilities.hidden._id.toString() === id
        )
          pokemon.abilities.hidden = updatedAbility;
        return {
          updateOne: {
            filter: { _id: pokemon._id },
            update: { $set: { abilities: pokemon.abilities } },
          },
        };
      })
    );
    if (bulkUpdate.length > 0) await pokemonDb.bulkWrite(bulkUpdate);
    await closePokemonDb();

    updatedAbility.updatedPokemon = allPokemon.map((pokemon) => pokemon.name);
    return updatedAbility;
  }
}
