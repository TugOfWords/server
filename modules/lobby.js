const express = require('express');
const firebase = require('../fire');

const lobbyRouter = express.Router();

/**
 * Creates a new entry at the /lobbys/:lid firebase endpoint
 * @param {String} lid
 *   the unique id that identifies the lobby in our database
 * @param {String} owner
 *   the uid of the user that created the lobby
 */
const createLobby = (lid, owner) => {
  firebase.ref(`/lobbys/${lid}`).set({
    active: true,
    owner,
  });
};

/**
 * Remove an entry at the /lobbys/:lid firebase endpoint
 * @param {string} lid
 *   the unique id that identifies the lobby in firebase
 */
const removeLobby = (lid) => {
  firebase.ref(`/lobbys/${lid}`).remove();
};

/**
 * Add a user to a lobby
 * @param {String} lid
 *   the unique id that identifies the lobby in firebase
 * @param {String} uid
 *   the unique id that identifies the user to remove from the lobby
 */
const joinLobby = (lid, uid) => {
  console.log('Joining lobby...');
  firebase.ref(`/lobbys/${lid}/users/${uid}`).set({
    word: 0,
    points: 0,
  });
};

/**
 * Remove the current user with the given uid from their current team
 * @param {String} lid
 *   the unique id that identifies the lobby in firebase
 * @param {String} uid
 *   the unique id that identifies the user to remove from the lobby
 */
const leaveTeam = (lid, uid) => {
  // Remove user from both teams just in case
  const updates = {};
  updates[`/lobbys/${lid}/t1/${uid}`] = null;
  updates[`/lobbys/${lid}/t2/${uid}`] = null;
  return firebase.ref().update(updates);
};

/**
 * Remove a user from the /lobbys/:lid/users/:uid endpoint as remove them from any teams they were
 * on i.e. /lobbys/:lid/t1/:uid
 * @param {String} lid
 *   the unique id that identifies the lobby in firebase
 * @param {String} uid
 *   the unique id that identifies the user to remove from the lobby
 */
const leaveLobby = (lid, uid) => {
  leaveTeam(lid, uid);
  firebase.ref(`/lobbys/${lid}/${uid}`).remove();
};

/**
 * Add a user to a team
 * @param {String} lid
 *   the unique id that identifies the lobby in firebase
 * @param {Number} teamNumber
 *   1 or 2
 * @param {String} uid
 *   the unique id that identifies the user to remove from the lobby
 */
const joinTeam = (lid, teamNumber, uid) => {
  firebase.ref(`/lobbys/${lid}/t${teamNumber}/${uid}`).set({ active: true });
};

/* API ROUTES */

lobbyRouter.post('/createLobby', (req, res) => {
  createLobby(req.body.lid, req.body.uid);
  res.send({ message: 'Success' });
});

module.exports = {
  lobbyRouter,
  createLobby,
  removeLobby,
  leaveLobby,
  joinLobby,
  joinTeam,
  leaveTeam,
};
