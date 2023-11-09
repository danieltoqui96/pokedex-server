import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect(collection) {
  await client.connect();
  return client.db('pokemondb').collection(collection);
}

export class PaldeaPokemonModel {
  static async getAll({ tipo, nombre }) {
    const [pokemonCollection, paldeaCollection] = await Promise.all([
      connect('pokemon'),
      connect('paldeaPokemon'),
    ]);

    const paldeaData = await paldeaCollection
      .find()
      .project({ paldeaNumber: 1, noroteoNumber: 1, pokemonId: 1 })
      .toArray();

    const pokemonDataPromises = paldeaData.map(async (paldea) => {
      const pokemonData = await pokemonCollection.findOne(
        { _id: new ObjectId(paldea.pokemonId) },
        {
          projection: {
            number: 1,
            name: 1,
            form: 1,
            types: 1,
            sprite: 1,
          },
        }
      );
      return { ...paldea, pokemonId: pokemonData };
    });

    let results = await Promise.all(pokemonDataPromises);

    if (tipo)
      results = results.filter((result) =>
        result.pokemonId.types.some((type) => type.includes(tipo.toLowerCase()))
      );

    if (nombre)
      results = results.filter((result) =>
        result.pokemonId.name.toLowerCase().includes(nombre.toLowerCase())
      );

    return results;
  }

  static async getById({ id }) {
    const [
      paldeaCollection,
      pokemonCollection,
      abilitiesCollection,
      movesCollection,
    ] = await Promise.all([
      connect('paldeaPokemon'),
      connect('pokemon'),
      connect('abilities'),
      connect('moves'),
    ]);

    const paldeaData = await paldeaCollection.findOne({
      _id: new ObjectId(id),
    });
    const pokemonDataPromise = pokemonCollection.findOne({
      _id: new ObjectId(paldeaData.pokemonId),
    });
    const abilitiesDataPromise = Promise.all(
      paldeaData.abilities.map((abilityId) =>
        abilitiesCollection.findOne({ _id: new ObjectId(abilityId) })
      )
    );
    const hiddenAbilityDataPromise = abilitiesCollection.findOne({
      _id: new ObjectId(paldeaData.hidenAbility),
    });
    const movesDataPromise = Promise.all(
      paldeaData.moves.map((moveId) =>
        movesCollection.findOne({ _id: new ObjectId(moveId) })
      )
    );

    const [pokemonData, abilitiesData, hiddenAbilityData, movesData] =
      await Promise.all([
        pokemonDataPromise,
        abilitiesDataPromise,
        hiddenAbilityDataPromise,
        movesDataPromise,
      ]);

    return {
      ...paldeaData,
      pokemonId: pokemonData,
      abilities: abilitiesData,
      hiddenAbility: hiddenAbilityData,
      moves: movesData,
    };
  }

  static async create({ input }) {
    const db = await connect('paldeaPokemon');
    input.lastModified = new Date();
    const { insertedId } = await db.insertOne(input);
    return { _id: insertedId, ...input };
  }

  static async delete({ id }) {
    const db = await connect('paldeaPokemon');
    const { deletedCount } = await db.deleteOne({ _id: new ObjectId(id) });
    return deletedCount > 0;
  }

  static async update({ id, input }) {
    const db = await connect('paldeaPokemon');
    input.lastModified = new Date();
    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { returnDocument: 'after' }
    );
    return result;
  }
}
