var {User} = require('./../models/user');

var authenticate = (req, res, next) => { // middleware
  var token = req.header('x-auth'); // req.header(): get method

  User.findByToken(token).then(user => {
    if (!user) {
      return Promise.reject();
    }

    // res.send(user);
    req.user = user;
    req.token = token;
    next();
  }).catch(e => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
