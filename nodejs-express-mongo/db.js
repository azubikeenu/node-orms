const { MongoClient, ObjectId } = require('mongodb');

const connectionUri = 'mongodb://localhost:27017';

const dbName = 'test';

let db;

const init = () => {
  return MongoClient.connect(connectionUri).then((client) => {
    console.log('connected to the db');
    db = client.db(dbName);
  });
};

const insertItem = async (item) => {
  const collection = db.collection('items');
  const { insertedId } = await collection.insertOne(item);
  return collection.find({ _id: new ObjectId(insertedId) }).toArray();
};

const getItems = () => {
  const collection = db.collection('items');
  return collection.find({}).toArray();
};

const updateItem = (id, quantity) => {
  const collection = db.collection('items');
  return collection.updateOne(
    { _id: new ObjectId(id) },
    { $inc: { quantity } }
  );
};

const deleteItem = (id) => {
  const collection = db.collection('items');
  return collection.deleteOne({ _id: new ObjectId(id) });
};

module.exports = { init, insertItem, updateItem, getItems, deleteItem };
