const express = require('express');
const firebase = require('../fire');

const userRouter = express.Router();

/**
 * Creates a new entry at the /users/:id firebase endpoint with the given username
 * @param {String} uid
 *   the unique id that identifies the user in our database
 * @param {String} username
 *   the in game name the user has chosen
 */
const createUser = (uid, username) => {
  firebase.ref(`users/${uid}`).set({
    username,
  });
};

/* API ROUTES */

userRouter.post('/createUser', (req, res) => {
  createUser(req.body.uid, req.body.username);
  res.send({ message: 'Success' });
});

const removeUser = (uid) => {
  firebase.ref(`users/${uid}`).remove();
};

userRouter.post('/removeUser', (req, res) => {
  removeUser(req.body.uid);
  res.send({ message: 'Success' });
});

module.exports = {
  createUser,
  removeUser,
  userRouter,
};
