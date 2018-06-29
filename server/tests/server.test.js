const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: '1st test todo'
}, {
  _id: new ObjectID(),
  text: '2st test todo',
  completed: true,
  completedAt: 333
}];

beforeEach(done => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', done => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });
  });

  it('should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        }).catch(e => done(e));
      });
  });

});

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get('/todos/1111')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', done => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // query database using findById toNotExist
        // expect(null).toNotExist();
        Todo.findById(hexId).then(todo => {
          expect(todo).toNotExist();
          // expect(todo).toBeFalsy();
          done();
        }).catch(e => done(e));
      });

  });

  it('should return 404 if todo not found', done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', done => {
    request(app)
      .delete('/todos/1111')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    // grad id of first item
    var hexId = todos[0]._id.toHexString();
    // var text = 'Do KEEP';

    // update text, set completed true
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text: 'Do KEEP',
        completed: true
      })
    // 200
      .expect(200)
    // text is changed, completed is true, completedAt is a number .toBeA
      .expect(res => {
        // expect(res).toInclude({
        //   text: 'Do KEEP',
        //   completed: true
        // }); // doesn't work, don't know why
        expect(res.body.todo.completedAt).toBeA('number');
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.text).toBe('Do KEEP');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', done => {
    // grad id of second todo item
    var hexId = todos[1]._id.toHexString();

    // update text, set completed to false
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text: 'Don\'t eat candy',
        completed: false
      })
    // 200
      .expect(200)
    // text is changed, completed false, completedAt is null .toNotExist
      .expect(res => {
        // expect(res).toInclude({
        //   text: 'Don\'t eat candy',
        //   completed: false,
        //   completedAt: null
        // }); // doesn't work, don't know why
        expect(res.body.todo.text).toBe('Don\'t eat candy');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});
