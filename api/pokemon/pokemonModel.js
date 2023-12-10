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

// Función para conectar a la base de datos y obtener la colección
async function connect(collection) {
  await client.connect();
  return client.db('pokemondb').collection(collection);
}

// Definimos la clase PokemonModel
export class PokemonModel {
  // Método para obtener todos los Pokémon
  static async getAll({ tipo, nombre }) {
    const db = await connect('pokemon');
    let query = {};
    if (tipo) query.types = { $regex: new RegExp(`${tipo}`, 'i') };
    if (nombre) query.name = { $regex: new RegExp(`${nombre}`, 'i') };
    return db.find(query).sort({ nationalNumber: 1 }).toArray();
  }

  // Método para obtener un Pokémon por su ID
  static async getById({ id }) {
    const db = await connect('pokemon');
    const pokemon = await db.findOne({ _id: new ObjectId(id) });
    if (!pokemon) throw new Error('NOT_FOUND');
    return pokemon;
  }

  // Método para crear un nuevo Pokémon
  static async create({ input }) {
    // Conectarse a la colección de habilidades
    const abilitiesDb = await connect('abilities');
    for (let game of input.gameData) {
      // Busca habilidades
      game.abilities.normal = await Promise.all(
        game.abilities.normal.map(async (id) => {
          const ability = await abilitiesDb.findOne(
            { _id: new ObjectId(id) },
            { projection: { lastModified: 0 } }
          );
          if (!ability) throw { message: 'NOT_FOUND_ABILITY', id: id };
          return ability; // Retorna habilidad con datos
        }) // Genera array de habilidades
      ); // Reemplaza por array de habilidades

      // Busca habilidad oculta
      game.abilities.hidden = await abilitiesDb.findOne(
        { _id: new ObjectId(game.abilities.hidden) },
        { projection: { lastModified: 0 } }
      );
      if (!game.abilities.hidden)
        throw { message: 'NOT_FOUND_ABILITY', id: game.abilities.hidden };
    }

    // Conectarse a la colección de Pokémon
    const pokemonDb = await connect('pokemon');
    input.lastModified = new Date().toLocaleString();
    const { insertedId } = await pokemonDb.insertOne(input);
    return { _id: insertedId, ...input };
  }

  // Método para eliminar un Pokémon por su ID
  static async delete({ id }) {
    const db = await connect('pokemon');
    const { deletedCount } = await db.deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) throw new Error('NOT_FOUND');
  }

  // Método para actualizar un Pokémon por su ID
  static async update({ id, input }) {
    // Conectarse a la colección de habilidades
    const abilitiesDb = await connect('abilities');
    if (input.gameData) {
      for (let game of input.gameData) {
        // Busca habilidades
        game.abilities.normal = await Promise.all(
          game.abilities.normal.map(async (id) => {
            const ability = await abilitiesDb.findOne(
              { _id: new ObjectId(id) },
              { projection: { lastModified: 0 } }
            );
            if (!ability) throw { message: 'NOT_FOUND_ABILITY', id: id };
            return ability; // Habilidad con datos
          }) // Genera array de habilidades
        ); // Reemplaza por array de habilidades

        // Busca habilidad oculta
        game.abilities.hidden = await abilitiesDb.findOne(
          { _id: new ObjectId(game.abilities.hidden) },
          { projection: { lastModified: 0 } }
        );
        if (!game.abilities.hidden)
          throw { message: 'NOT_FOUND_ABILITY', id: game.abilities.hidden };
      }
    }

    // Conectarse a la colección de Pokémon
    const pokemonDb = await connect('pokemon');
    input.lastModified = new Date().toLocaleString();
    const updatedPokemon = await pokemonDb.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    if (!updatedPokemon) throw new Error('NOT_FOUND');
    return updatedPokemon;
  }
}
