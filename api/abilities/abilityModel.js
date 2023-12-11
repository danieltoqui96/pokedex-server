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
  return client.db('pokemondb').collection(collection);
}

export class AbilityModel {
  // Obtener todas las habilidades
  static async getAll({ nombre }) {
    const db = await connect('abilities');
    let query = {};
    if (nombre)
      query.$or = [
        { 'name.spanish': { $regex: new RegExp(`${nombre}`, 'i') } },
        { 'name.english': { $regex: new RegExp(`${nombre}`, 'i') } },
      ];
    return db.find(query).sort({ 'name.spanish': 1 }).toArray();
  }

  // Obtener una habilidad por ID
  static async getById({ id }) {
    const db = await connect('abilities');
    const ability = await db.findOne({ _id: new ObjectId(id) });
    if (!ability) throw new Error('NOT_FOUND');
    return ability;
  }

  // Crear una nueva habilidad
  static async create({ input }) {
    const db = await connect('abilities');
    input.lastModified = new Date().toLocaleString();
    const { insertedId } = await db.insertOne(input);
    return { _id: insertedId, ...input };
  }

  // Eliminar una habilidad
  static async delete({ id }) {
    const pokemonDb = await connect('pokemon');
    const allPokemon = await pokemonDb
      .find({
        $or: [
          { 'abilities.normal._id': new ObjectId(id) },
          { 'abilities.hidden._id': new ObjectId(id) },
        ],
      })
      .toArray();

    if (allPokemon.length > 0)
      throw {
        message: 'ABILITY_IN_USE',
        pokemon: allPokemon.map((pokemon) => pokemon.name),
      };

    const db = await connect('abilities');
    const { deletedCount } = await db.deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) throw new Error('NOT_FOUND');
  }

  // Actualizar una habilidad
  static async update({ id, input }) {
    const abilitiesDb = await connect('abilities');
    input.lastModified = new Date().toLocaleString();
    const updatedAbility = await abilitiesDb.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    if (!updatedAbility) throw new Error('NOT_FOUND');
    delete updatedAbility.lastModified;

    const pokemonDb = await connect('pokemon');
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

    updatedAbility.updatedPokemon = allPokemon.map((pokemon) => pokemon.name);
    return updatedAbility;
  }
}
