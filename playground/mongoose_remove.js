const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then(result => {
//   console.log(result);
// });

Todo.findByIdAndRemove('5b351c83437c93eab54cd6b8').then(todo => {
  console.log(todo);
});

// Todo.findOneAndRemove({_id: '5b351c83437c93eab54cd6b8'}).then(todo => {
//
// });
