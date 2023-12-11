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
    const abilitiesDb = await connect('abilities');
    input.abilities.normal = await Promise.all(
      input.abilities.normal.map(async (id) => {
        const ability = await abilitiesDb.findOne(
          { _id: new ObjectId(id) },
          { projection: { lastModified: 0 } }
        );
        if (!ability) throw { message: 'NOT_FOUND_ABILITY', id: id };
        return ability;
      })
    );

    input.abilities.hidden = await abilitiesDb.findOne(
      { _id: new ObjectId(input.abilities.hidden) },
      { projection: { lastModified: 0 } }
    );
    if (!input.abilities.hidden)
      throw { message: 'NOT_FOUND_ABILITY', id: input.abilities.hidden };

    const movesDb = await connect('moves');
    input.moves.moveByLevel = await Promise.all(
      input.moves.moveByLevel.map(async (moveObj) => {
        const move = await movesDb.findOne(
          { _id: new ObjectId(moveObj.move) },
          { projection: { lastModified: 0 } }
        );
        if (!move) throw { message: 'NOT_FOUND_MOVE', id: moveObj.move };
        return {
          move: move,
          level: moveObj.level,
        };
      })
    );

    // Validar que el movimiento sea mt
    input.moves.movesByMt = await Promise.all(
      input.moves.movesByMt.map(async (id) => {
        const move = await movesDb.findOne(
          { _id: new ObjectId(id) },
          { projection: { lastModified: 0 } }
        );
        if (!move) throw { message: 'NOT_FOUND_MOVE', id: id };
        return move;
      })
    );

    input.moves.movesByEgg = await Promise.all(
      input.moves.movesByEgg.map(async (id) => {
        const move = await movesDb.findOne(
          { _id: new ObjectId(id) },
          { projection: { lastModified: 0 } }
        );
        if (!move) throw { message: 'NOT_FOUND_MOVE', id: id };
        return move;
      })
    );

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
    if (input.abilities) {
      const abilitiesDb = await connect('abilities');
      input.abilities.normal = await Promise.all(
        input.abilities.normal.map(async (id) => {
          const ability = await abilitiesDb.findOne(
            { _id: new ObjectId(id) },
            { projection: { lastModified: 0 } }
          );
          if (!ability) throw { message: 'NOT_FOUND_ABILITY', id: id };
          return ability;
        })
      );

      input.abilities.hidden = await abilitiesDb.findOne(
        { _id: new ObjectId(input.abilities.hidden) },
        { projection: { lastModified: 0 } }
      );
      if (!input.abilities.hidden)
        throw { message: 'NOT_FOUND_ABILITY', id: input.abilities.hidden };
    }

    if (input.moves) {
      const movesDb = await connect('moves');
      input.moves.moveByLevel = await Promise.all(
        input.moves.moveByLevel.map(async (moveObj) => {
          const move = await movesDb.findOne(
            { _id: new ObjectId(moveObj.move) },
            { projection: { lastModified: 0 } }
          );
          if (!move) throw { message: 'NOT_FOUND_MOVE', id: moveObj.move };
          return {
            move: move,
            level: moveObj.level,
          };
        })
      );

      input.moves.movesByMt = await Promise.all(
        input.moves.movesByMt.map(async (id) => {
          const move = await movesDb.findOne(
            { _id: new ObjectId(id) },
            { projection: { lastModified: 0 } }
          );
          if (!move) throw { message: 'NOT_FOUND_MOVE', id: id };
          return move;
        })
      );

      input.moves.movesByEgg = await Promise.all(
        input.moves.movesByEgg.map(async (id) => {
          const move = await movesDb.findOne(
            { _id: new ObjectId(id) },
            { projection: { lastModified: 0 } }
          );
          if (!move) throw { message: 'NOT_FOUND_MOVE', id: id };
          return move;
        })
      );
    }

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
