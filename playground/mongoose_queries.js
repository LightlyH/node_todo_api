const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5b343b403225459c5eeedee3111';
//
// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid');
// }

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then(todo => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo', todo);
// }).catch(e => console.log(e));


// or:

// User.findById('5b33ebecb791bb962faec12d').then(user => {
//   if (!user) {
//     return console.log('User not found');
//   }
//   console.log('User', user);
// }).catch(e => console.log('User id not valid')); // chain catch() after then()

User.findById('5b33ebecb791bb962faec12d').then(user => {
  if (!user) {
    return console.log('User not found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}, e => console.log(e)); // two callbacks inside then()
