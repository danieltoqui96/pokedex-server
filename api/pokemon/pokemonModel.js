// Importamos las dependencias necesarias
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

// Creamos una nueva instancia de MongoClient con la URI de MongoDB y las opciones del servidor
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Función para conectar a la base de datos y obtener la colección 'pokemon'
async function connect() {
  await client.connect();
  return client.db('pokemondb').collection('pokemon');
}

// Definimos la clase PokemonModel
export class PokemonModel {
  // Método para obtener todos los Pokémon
  static async getAll({ tipo, nombre }) {
    const db = await connect();
    let query = {};
    if (tipo) query.types = { $regex: new RegExp(`${tipo}`, 'i') };
    if (nombre) query.name = { $regex: new RegExp(`${nombre}`, 'i') };
    return db.find(query).sort({ number: 1 }).toArray();
  }

  // Método para obtener un Pokémon por su ID
  static async getById({ id }) {
    const db = await connect();
    const pokemon = await db.findOne({ _id: new ObjectId(id) });
    if (!pokemon) throw new Error('NOT_FOUND');
    return pokemon;
  }

  // Método para crear un nuevo Pokémon
  static async create({ input }) {
    const db = await connect();
    input.lastModified = new Date().toLocaleString();
    const { insertedId } = await db.insertOne(input);
    return { _id: insertedId, ...input };
  }

  // Método para eliminar un Pokémon por su ID
  static async delete({ id }) {
    const db = await connect();
    const { deletedCount } = await db.deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) throw new Error('NOT_FOUND');
  }

  // Método para actualizar un Pokémon por su ID
  static async update({ id, input }) {
    const db = await connect();
    input.lastModified = new Date().toLocaleString();
    const updatedPokemon = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    if (!updatedPokemon) throw new Error('NOT_FOUND');
    return updatedPokemon;
  }
}
