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
  static async getAll() {
    const collectionPaldea = await connect('paldeaPokemon');
    const collectionPokemon = await connect('pokemon');

    // Obtén todos los documentos de Paldea
    const paldeas = await collectionPaldea.find().toArray();

    // Para cada documento de Paldea, obtén el documento de Pokémon correspondiente
    const promises = paldeas.map(async (paldea) => {
      const pokemon = await collectionPokemon.findOne(
        { _id: new ObjectId(paldea.pokemonId) },
        { projection: { number: 1, name: 1, types: 1, sprite: 1 } } // Proyección
      );
      return { ...paldea, pokemon };
    });

    // Espera a que todas las promesas se resuelvan
    const results = await Promise.all(promises);

    return results;
  }

  static async getById({ id }) {
    const [
      collectionPaldea,
      collectionPokemon,
      collectionAbilities,
      collectionMoves,
    ] = await Promise.all([
      connect('paldeaPokemon'),
      connect('pokemon'),
      connect('abilities'),
      connect('moves'),
    ]);

    const pokemonPaldea = await collectionPaldea.findOne({
      _id: new ObjectId(id),
    });
    const pokemonPromise = collectionPokemon.findOne({
      _id: new ObjectId(pokemonPaldea.pokemonId),
    });
    const abilitiesPromise = Promise.all(
      pokemonPaldea.abilities.map((id) =>
        collectionAbilities.findOne({ _id: new ObjectId(id) })
      )
    );
    const hiddenAbilityPromise = collectionAbilities.findOne({
      _id: new ObjectId(pokemonPaldea.hidenAbility),
    });
    const movesPromise = Promise.all(
      pokemonPaldea.moves.map((id) =>
        collectionMoves.findOne({ _id: new ObjectId(id) })
      )
    );

    const [pokemon, abilities, hiddenAbility, moves] = await Promise.all([
      pokemonPromise,
      abilitiesPromise,
      hiddenAbilityPromise,
      movesPromise,
    ]);

    return {
      ...pokemonPaldea,
      pokemonId: pokemon,
      abilities,
      hiddenAbility,
      moves,
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
