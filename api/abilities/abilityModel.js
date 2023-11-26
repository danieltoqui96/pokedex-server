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

// Función para conectar a la base de datos y obtener la colección 'abilities'
async function connect() {
  await client.connect();
  return client.db('pokemondb').collection('abilities');
}

// Definimos la clase AbilityModel
export class AbilityModel {
  // Método para obtener todas las habilidades
  static async getAll({ nombre }) {
    const db = await connect();
    let query = {};
    if (nombre)
      query.$or = [
        { nameSp: { $regex: new RegExp(`${nombre}`, 'i') } },
        { nameEn: { $regex: new RegExp(`${nombre}`, 'i') } },
      ];
    return db.find(query).sort({ nameSp: 1 }).toArray();
  }

  // Método para obtener una habilidad por su ID
  static async getById({ id }) {
    const db = await connect();
    const ability = await db.findOne({ _id: new ObjectId(id) });
    if (!ability) throw new Error('NOT_FOUND');
    return ability;
  }

  // Método para crear una nueva habilidad
  static async create({ input }) {
    const db = await connect();
    input.lastModified = new Date().toLocaleString();
    const { insertedId } = await db.insertOne(input);
    return { _id: insertedId, ...input };
  }

  // Método para eliminar una habilidad por su ID
  static async delete({ id }) {
    const db = await connect();
    const { deletedCount } = await db.deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) throw new Error('NOT_FOUND');
  }

  // Método para actualizar una habilidad por su ID
  static async update({ id, input }) {
    const db = await connect();
    input.lastModified = new Date().toLocaleString();
    const updatedAbility = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    if (!updatedAbility) throw new Error('NOT_FOUND');
    return updatedAbility;
  }
}
