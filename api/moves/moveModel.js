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

// Definimos la clase MoveModel
export class MoveModel {
  // Método para obtener todos los movimientos
  static async getAll({ tipo, nombre }) {
    const db = await connect('moves');
    let query = {};
    if (tipo) query.type = { $regex: new RegExp(`${tipo}`, 'i') };
    if (nombre)
      query.$or = [
        { 'name.spanish': { $regex: new RegExp(`${nombre}`, 'i') } },
        { 'name.english': { $regex: new RegExp(`${nombre}`, 'i') } },
      ];
    return db.find(query).sort({ 'name.spanish': 1 }).toArray();
  }

  // Método para obtener un movimiento por su ID
  static async getById({ id }) {
    const db = await connect('moves');
    const move = await db.findOne({ _id: new ObjectId(id) });
    if (!move) throw new Error('NOT_FOUND');
    return move;
  }

  // Método para crear un nuevo movimiento
  static async create({ input }) {
    const db = await connect('moves');
    input.lastModified = new Date().toLocaleString();
    const { insertedId } = await db.insertOne(input);
    return { _id: insertedId, ...input };
  }

  // Método para eliminar un movimiento por su ID
  static async delete({ id }) {
    const pokemonDb = await connect('pokemon');
    const allPokemon = await pokemonDb
      .find({
        $or: [
          { 'moves.moveByLevel.move._id': new ObjectId(id) },
          { 'moves.movesByMt._id': new ObjectId(id) },
          { 'moves.movesByEgg.id': new ObjectId(id) },
        ],
      })
      .toArray();

    if (allPokemon.length > 0)
      throw {
        message: 'MOVE_IN_USE',
        pokemon: allPokemon.map((pokemon) => pokemon.name),
      };

    const db = await connect('moves');
    const { deletedCount } = await db.deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) throw new Error('NOT_FOUND');
  }

  // Método para actualizar un movimiento por su ID
  static async update({ id, input }) {
    const movesdb = await connect('moves');
    input.lastModified = new Date().toLocaleString();
    const updatedMove = await movesdb.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    if (!updatedMove) throw new Error('NOT_FOUND');
    delete updatedMove.lastModified;

    const pokemonDb = await connect('pokemon');
    const allPokemon = await pokemonDb
      .find({
        $or: [
          { 'moves.moveByLevel.move._id': new ObjectId(id) },
          { 'moves.movesByMt._id': new ObjectId(id) },
          { 'moves.movesByEgg.id': new ObjectId(id) },
        ],
      })
      .toArray();

    const bulkWriteOperations = await Promise.all(
      allPokemon.map(async (pokemon) => {
        pokemon.moves.moveByLevel = pokemon.moves.moveByLevel.map((moveObj) =>
          moveObj.move._id.toString() === id ? updatedMove : moveObj
        );

        pokemon.moves.movesByMt = pokemon.moves.movesByMt.map((move) =>
          move._id.toString() === id ? updatedMove : move
        );

        pokemon.moves.movesByEgg = pokemon.moves.movesByEgg.map((move) =>
          move._id.toString() === id ? updatedMove : move
        );

        return {
          updateOne: {
            filter: { _id: pokemon._id },
            update: { $set: { moves: pokemon.moves } },
          },
        };
      })
    );

    if (bulkWriteOperations.length > 0)
      await pokemonDb.bulkWrite(bulkWriteOperations);

    updatedMove.updatedPokemon = allPokemon.map((pokemon) => pokemon.name);
    return updatedMove;
  }
}
