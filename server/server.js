var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({todos});
  }, e => {
    res.status(400).send(e);
  });
});


app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};






// var newUser = new User({
//   email: 'sam@mir.com      '
// });
//
// newUser.save().then(doc => {
//   console.log('Saved user', doc);
// }, e => {
//   console.log('Unable to save user', e);
// });
// // var newTodo = new Todo({
//   text: 'Eat avocado'
// });
//
// newTodo.save().then(doc => {
//   console.log('Saved todo', doc);
// }, e => {
//   console.log('Unable to save todo');
// });
// var newTodo2 = new Todo({
//   text: ' Do KEEP     ',
//   // completed: false,
//   // completedAt: 7
//   // text: ''
// });

// newTodo2.save().then(doc => {
//   console.log('Saved todo', doc);
// }, e => {
//   console.log('Unable to save todo');
// });
