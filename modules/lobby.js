const firebase = require('../fire');
const express = require('express');

const lobbyRouter = express.Router();

/**
 * Creates a new entry at the /lobbys/:id firebase endpoint with the given lobbyname
 * @param {String} lid
 *   the unique id that identifies the lobby in our database
 * @param {String} owner
 *   the uid of the user that created the lobby
 */
const createLobby = (lid, owner) => {
  firebase.ref(`lobbys/${lid}`).set({
    active: true,
    owner,
    users: owner,
  });
};

const removeLobby = (lid) => {
  firebase.ref(`lobbys/${lid}`).remove();
};

const joinTeam = (team, uid, lid) => {
  firebase.ref(`lobbys/${lid}/users/${uid}`).set({
    score: 0,
    word: '',
  });

  if (team === 1) {
    firebase.ref(`lobbys/${lid}/t1`).set({
      uid,
    });
  } else {
    firebase.ref(`lobbys/${lid}/t2`).set({
      uid,
    });
  }
};


lobbyRouter.post('/createLobby', (req, res) => {
  createLobby(req.body.lid, req.body.uid);
  res.send({ message: 'Success' });
});

module.exports = {
  createLobby,
  lobbyRouter,
  joinTeam,
  removeLobby,
};
