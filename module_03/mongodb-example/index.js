const mongodb = require('mongodb');
const { MongoClient } = mongodb;
const DB_NAME = 'test_db';

async function main() {
  const client = await MongoClient.connect(process.env.MONGODB_URL);
  console.log('Successfully conect to DB');

  const db = client.db(DB_NAME);
  const example_collection = db.collection('example_collection');

  //   await example_collection.insertMany([
  //     {
  //       name: 'hello',
  //       title: 'world',
  //     },
  //     {
  //       age: 32,
  //       email: 'sini@box',
  //     },
  //   ]);

  // console.log(await example_collection.find({ age: 12 }).toArray());
  console.log(
    await example_collection
      .find({ $or: [{ age: 12 }, { name: 'hello' }] })
      .toArray()
  );
}

main();
