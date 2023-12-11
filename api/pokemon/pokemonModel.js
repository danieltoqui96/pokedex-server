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
  static async getAll({ tipo, nombre }) {
    let query = {};
    if (tipo) query.types = { $regex: new RegExp(`${tipo}`, 'i') };
    if (nombre) query.name = { $regex: new RegExp(`${nombre}`, 'i') };
    const { db, close } = await connect('pokemon');
    const allPokemon = await db
      .find(query)
      .sort({ nationalNumber: 1 })
      .toArray();
    await close();
    return allPokemon;
  }

  // Obtener un Pokémon por ID
  static async getById({ id }) {
    const { db, close } = await connect('pokemon');
    const pokemon = await db.findOne({ _id: new ObjectId(id) });
    await close();
    if (!pokemon) throw new Error('NOT_FOUND');
    return pokemon;
  }

  // Crear un nuevo Pokémon
  static async create({ input }) {
    const { db: abilitiesDb, close: closeAbilitiesDb } = await connect(
      'abilities'
    );
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
    await closeAbilitiesDb();

    const { db: movesDb, close: closeMovesDb } = await connect('moves');
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
        if (move && move.mt === null)
          throw { message: 'MOVE_IS_NOT_MT', id: id };
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
    await closeMovesDb();

    input.lastModified = new Date().toLocaleString();
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
    if (deletedCount === 0) throw new Error('NOT_FOUND');
  }

  // Actualizar un Pokémon
  static async update({ id, input }) {
    if (input.abilities) {
      const { db: abilitiesDb, close: closeAbilitiesDb } = await connect(
        'abilities'
      );
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
      await closeAbilitiesDb();
    }

    if (input.moves) {
      const { db: movesDb, close: closeMovesDb } = await connect('moves');
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
          if (move && move.mt === null)
            throw { message: 'MOVE_IS_NOT_MT', id: id };
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
      await closeMovesDb();
    }

    input.lastModified = new Date().toLocaleString();
    const { db, close } = await connect('pokemon');
    const updatedPokemon = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    if (!updatedPokemon) throw new Error('NOT_FOUND');
    await close();
    return updatedPokemon;
  }
}
