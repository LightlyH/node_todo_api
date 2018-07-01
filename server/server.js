require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
// const port = process.env.PORT || 3000;
const port = process.env.PORT;


app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(todos => {
    res.send({todos});
  }, e => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  // res.send(req.params);
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send(); // need return!
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }, e => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  // get the id
  const id = req.params.id;

  // validate the id -> not valid? return 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if (!todo) {
      return res.status(404).send();
    }
    // if doc, send doc back with 200
    res.status(200).send({todo});

  } catch (e) {
    res.status(400).send();
  }

  // // remove todo by id
  // Todo.findOneAndRemove({
  //   _id: id,
  //   _creator: req.user._id
  // }).then(todo => {
  //   // success
  //     // if no doc, send 404
  //     if (!todo) {
  //       return res.status(404).send();
  //     }
  //     // if doc, send doc back with 200
  //     res.status(200).send({todo});
  // }, e => {
  //   // error
  //     // 400 with empty body
  //     res.status(400).send();
  // });

});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch(e => {
    res.status(400).send();
  });

});

app.post('/users', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user); // res.header(): set method
  } catch (e) {
    res.status(400).send(e);
  }

});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }

});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }

});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
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
