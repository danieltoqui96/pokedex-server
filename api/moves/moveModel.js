import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  await client.connect();
  return client.db('pokemondb').collection('moves');
}

export class MoveModel {
  static async getAll({ tipo, nombre }) {
    const db = await connect();
    let query = {};
    if (tipo) query.type = { $regex: new RegExp(`${tipo}`, 'i') };
    if (nombre)
      query.$or = [
        { nameSp: { $regex: new RegExp(`${nombre}`, 'i') } },
        { nameEn: { $regex: new RegExp(`${nombre}`, 'i') } },
      ];
    return db.find(query).sort({ nameSp: 1 }).toArray();
  }

  static async getById({ id }) {
    const db = await connect();
    return db.findOne({ _id: new ObjectId(id) });
  }

  static async create({ input }) {
    const db = await connect();
    input.lastModified = new Date();
    const { insertedId } = await db.insertOne(input);
    return { _id: insertedId, ...input };
  }

  static async delete({ id }) {
    const db = await connect();
    const { deletedCount } = await db.deleteOne({ _id: new ObjectId(id) });
    return deletedCount > 0;
  }

  static async update({ id, input }) {
    const db = await connect();
    input.lastModified = new Date();
    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    return result;
  }
}
