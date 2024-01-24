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

export class PokemonModel {
  // Obtener todos los Pokémon
  static async getAll({ type, name }) {
    let query = {};
    if (type) query.types = { $regex: new RegExp(`${type}`, 'i') };
    if (name) query.name = { $regex: new RegExp(`${name}`, 'i') };
    const { db, close } = await connect('pokemon');
    const allPokemon = await db
      .find(query, { projection: { number: 1, name: 1, form: 1, types: 1 } })
      .sort({ 'number.national': 1 })
      .toArray();
    await close();
    return allPokemon;
  }

  // Obtener un Pokémon por ID
  static async getById({ id }) {
    const { db, close } = await connect('pokemon');
    const pokemon = await db.findOne({ _id: new ObjectId(id) });
    await close();
    if (!pokemon) throw { message: 'NOT_FOUND', id: id };
    return pokemon;
  }

  // Crear un nuevo Pokémon
  static async create({ input }) {
    const { db, close } = await connect('pokemon');
    const { insertedId } = await db.insertOne(input);
    await close();
    return { _id: insertedId, ...input };
  }

  // Eliminar un Pokémon
  static async delete({ id }) {
    const { db, close } = await connect('pokemon');
    const { deletedCount } = await db.deleteOne({ _id: new ObjectId(id) });
    await close();
    if (deletedCount === 0) throw { message: 'NOT_FOUND', id: id };
  }

  // Actualizar un Pokémon
  static async update({ id, input }) {
    const { db, close } = await connect('pokemon');
    const updatedPokemon = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    if (!updatedPokemon) throw { message: 'NOT_FOUND', id: id };
    await close();
    return updatedPokemon;
  }

  // Método para ingresar muchos Pokemon mediante un archivo
  static async createMany({ input }) {
    const { db, close } = await connect('pokemon');
    const { insertedIds } = await db.insertMany(input);
    await close();
    return Object.values(insertedIds).map((id, index) => ({
      _id: id,
      ...input[index],
    }));
  }
}
