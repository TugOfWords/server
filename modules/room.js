const firebase = require('../fire');
const express = require('express');

const roomRouter = express.Router();

/**
 * Creates a new entry at the /rooms/:id firebase endpoint with the given roomname
 * @param {String} rid
 *   the unique id that identifies the room in our database
 * @param {String} owner
 *   the uid of the user that created the room
 */
const createRoom = (rid, owner) => {
  firebase.ref(`rooms/${rid}`).set({
    active: true,
    owner,
    users: owner,
  });
};

roomRouter.post('/createRoom', (req, res) => {
  createRoom(req.body.rid, req.body.uid);
  res.send({ message: 'Success' });
});

module.exports = {
  createRoom,
  roomRouter,
};
