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

const removeRoom = (rid) => {
  firebase.ref(`rooms/${rid}`).remove();
};

const joinTeam = (team, uid, rid) => {
  firebase.ref(`rooms/${rid}/users/${uid}`).set({
    score: 0,
    word: '',
  });

  if (team === 1) {
    firebase.ref(`rooms/${rid}/t1`).set({
      uid,
    });
  } else {
    firebase.ref(`rooms/${rid}/t2`).set({
      uid,
    });
  }
};


roomRouter.post('/createRoom', (req, res) => {
  createRoom(req.body.rid, req.body.uid);
  res.send({ message: 'Success' });
});

module.exports = {
  createRoom,
  roomRouter,
  joinTeam,
  removeRoom,
};
