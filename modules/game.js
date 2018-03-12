const randomWords = require('rword');
const firebase = require('../fire');

/**
 * Generates a random words for test suite
 */
const getWord = () => randomWords.generate();

/**
 * Generates a random word
 * @returns {String}
 *   the generated word
 */
const sendWord = async (lid, uid) => {
  const randWord = randomWords.generate();
  const ref = await firebase.ref(`/lobbys/${lid}/users/${uid}`);
  ref.set({ word: randWord });
  return randWord;
};


/**
 * Verifies the submitted word against the word stored
 * in the user's object in the firebase lobby
 * @returns {String}
 *   the generated word
 */

const verifyWord = async (lid, uid, submittedWord) => {
  let currWord = '';
  await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value').then((snapshot) => {
    currWord = snapshot.val().word;
  });
  return currWord === submittedWord;
};

/**
 * Adds a point for the user at the lobby/${lid}/users/${uid} endpoint
 * @param {String} uid
 *   the uid of the user that deserves a point
 * @param {String} lid
 *   the lid of the lobby that the user is in
 *
 * unit test exists
 */
const addPoint = async (lid, uid) => {
  let bp;
  await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value').then((snap) => {
    bp = snap.val().points;
    firebase.ref(`/lobbys/${lid}/users/${uid}/points`).set({
      points: bp + 1,
    });
  });
};

/**
 * Removes a point for the user at the lobby/${lid}/users/${uid} endpoint
 * @param {String} uid
 *   the uid of the user that deserves a point
 * @param {String} lid
 *   the lid of the lobby that the user is in
 *
 *  unit test exists
 */
const removePoint = async (lid, uid) => {
  let bp;
  await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value').then((snap) => {
    bp = snap.val().points;
    firebase.ref(`/lobbys/${lid}/users/${uid}/points`).set({
      points: bp - 1,
    });
  });
};

const whichTeam = async (lid, uid) => {
  let t1 = false;
  let t2 = false;

  await firebase.ref(`/lobbys/${lid}/t1/${uid}`).once('value').then((snap) => {
    t1 = snap.exists();
  });

  await firebase.ref(`/lobbys/${lid}/t2/${uid}`).once('value').then((snap) => {
    t2 = snap.exists();
  });

  if (!t1 && !t2) return 0;
  return t1 ? 1 : 2;
};


module.exports = {
  sendWord,
  verifyWord,
  addPoint,
  removePoint,
  getWord,
  whichTeam,
};
