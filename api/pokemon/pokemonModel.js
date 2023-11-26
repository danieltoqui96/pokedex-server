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
    return db.findOne({ _id: new ObjectId(id) });
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
    return deletedCount > 0;
  }

  // Método para actualizar un Pokémon por su ID
  static async update({ id, input }) {
    const db = await connect();
    input.lastModified = new Date().toLocaleString();
    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    return result;
  }

  // Método para añadir un juego a un Pokémon
  static async addGame({ id, input }) {
    const db = await connect();
    const pokemon = await db.findOne({ _id: new ObjectId(id) });
    if (!pokemon) throw new Error('Pokémon no existe');
    const gameExists = pokemon.games.some(
      (game) => game.pokemonGames === input.pokemonGames
    );
    if (gameExists) throw new Error('juego ya existe');
    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $push: { games: input },
        $set: { lastModified: new Date().toLocaleString() },
      },
      { returnDocument: 'after' }
    );
    return result;
  }

  // Método para eliminar un juego de un Pokémon
  static async deleteGame({ id, gameName }) {
    const db = await connect();
    const pokemon = await db.findOne({ _id: new ObjectId(id) });
    if (!pokemon) throw new Error('Pokémon no existe');
    const gameIndex = pokemon.games.findIndex(
      (game) => game.pokemonGames === gameName
    );
    if (gameIndex === -1) throw new Error('juego no existe');
    pokemon.games.splice(gameIndex, 1);
    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          games: pokemon.games,
          lastModified: new Date().toLocaleString(),
        },
      },
      { returnDocument: 'after' }
    );
    return result;
  }

  // Método para editar un juego de un Pokémon
  static async editGame({ id, gameName, gameData }) {
    const db = await connect();
    const pokemon = await db.findOne({ _id: new ObjectId(id) });
    if (!pokemon) throw new Error('Pokémon no existe');
    const gameIndex = pokemon.games.findIndex(
      (game) => game.pokemonGames === gameName
    );
    if (gameIndex === -1) {
      throw new Error('juego no existe');
    }
    pokemon.games[gameIndex] = { ...pokemon.games[gameIndex], ...gameData };
    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          games: pokemon.games,
          lastModified: new Date().toLocaleString(),
        },
      },
      { returnDocument: 'after' }
    );
    return result;
  }
}
