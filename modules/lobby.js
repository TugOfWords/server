const shortid = require('shortid');
const express = require('express');
const firebase = require('../fire');

const lobbyRouter = express.Router();

let pLobbyCount = 0; // number of users in the current public lobby
let pLobbyID = null; // lid of the current public lobby

/**
 * Creates a new entry at the /lobbys/:lid firebase endpoint
 * @param {String} lid
 *   the unique id that identifies the lobby in our database
 * @param {String} owner
 *   the uid of the user that created the lobby
 */
const createLobby = async (lid, owner) => {
  try {
    await firebase.ref(`/lobbys/${lid}`).set({
      active: true,
      owner,
    });
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Add a user to a lobby
 * @param {String} lid
 *   the unique id that identifies the lobby in firebase
 * @param {String} uid
 *   the unique id that identifies the user to remove from the lobby
 */
const joinLobby = async (lid, uid) => {
  try {
    if (!(await firebase.ref(`/lobbys/${lid}/active`).once('value'))) {
      return false;
    }
    await firebase.ref(`/lobbys/${lid}/users/${uid}`).set({
      word: 0,
      points: 0,
    });
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Remove the current user with the given uid from their current team
 * @param {String} lid
 *   the unique id that identifies the lobby in firebase
 * @param {String} uid
 *   the unique id that identifies the user to remove from the lobby
 */
const leaveTeam = async (lid, uid) => {
  try {
    const updates = {};
    updates[`/lobbys/${lid}/t1/${uid}`] = null;
    updates[`/lobbys/${lid}/t2/${uid}`] = null;
    await firebase.ref().update(updates);
    return true;
  } catch (e) {
    return null;
  }
};

/**
 * Remove a user from the /lobbys/:lid/users/:uid endpoint as remove them from any teams they were
 * on i.e. /lobbys/:lid/t1/:uid
 * @param {String} lid
 *   the unique id that identifies the lobby in firebase
 * @param {String} uid
 *   the unique id that identifies the user to remove from the lobby
 */
const leaveLobby = async (lid, uid) => {
  try {
    leaveTeam(lid, uid);
    await firebase.ref(`/lobbys/${lid}/${uid}`).remove();
    await firebase.ref(`/lobbys/${lid}/users/${uid}`).remove();
    if (lid === pLobbyID) pLobbyCount -= 1;
    return true;
  } catch (e) {
    return false;
  }
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
const joinTeam = async (lid, teamNumber, uid) => {
  try {
    leaveTeam(lid, uid);
    const snapshot = await firebase.ref(`/users/${uid}`).once('value');
    const { username } = snapshot.val();
    await firebase.ref(`/lobbys/${lid}/t${teamNumber}/${uid}`).set({ username });
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get the users on each team for a given lobby
 * @param {String} lid
 *   the unique id that identifies the lobby in firebase
 */
const getTeams = async (lid) => {
  const snapshot = await firebase.ref(`/lobbys/${lid}`).once('value');
  const { t1, t2 } = snapshot.val();
  return { t1: t1 || {}, t2: t2 || {} };
};

/**
 * Create a new public lobby and add it to firebase
 */
const createPublicLobby = async () => {
  pLobbyID = `p_${encodeURIComponent(shortid.generate())}`;
  createLobby(pLobbyID, null);
  pLobbyCount = 0;
};

/**
 * returns the first available public lobby lid and creates one if there are none
 */
const joinPublicLobby = async (uid) => {
  if (joinLobby(pLobbyID, uid)) {
    pLobbyCount += 1;
  } else {
    createPublicLobby();
    await joinPublicLobby(pLobbyID, uid);
  }
  // auto join team for public lobbys
  const teamNumber = (pLobbyCount % 2) + 1;
  await joinTeam(pLobbyID, teamNumber, uid);
};

/* API ROUTES */

lobbyRouter.post('/createLobby', (req, res) => {
  createLobby(req.body.lid, req.body.uid);
  res.send({ message: 'Success' });
});

lobbyRouter.get('/publicLobby', async (req, res) => {
  const active = (await firebase.ref(`/lobbys/${pLobbyID}/active`).once('value')).val();
  if (pLobbyID === null || pLobbyCount > 49 || !active) {
    createPublicLobby();
  }
  res.send({ lid: pLobbyID });
});

module.exports = {
  lobbyRouter,
  createLobby,
  leaveLobby,
  joinLobby,
  joinTeam,
  leaveTeam,
  getTeams,
  joinPublicLobby,
};
