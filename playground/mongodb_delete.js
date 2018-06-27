// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }
  console.log('Connected to MongoDB server.');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Buy food'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Buy food'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

    db.collection('Users').deleteMany({name: 'Lily'}).then((result) => {
      console.log(result);
    });
    db.collection('Users').findOneAndDelete({
      _id: new ObjectID("5b33a469e7552b8e48f743f7")}).then((result) => {
      console.log(result);
      console.log('???');
      console.log(JSON.stringify(result, undefined, 2));
    });

  // db.close();
});
