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
const sendWord = async (lid, uid, socket) => {
  const randWord = randomWords.generate();
  const ref = await firebase.ref(`/lobbys/${lid}/users/${uid}`);
  ref.set({ word: randWord });
  socket.emit('sendWord', { newWord: randWord });
};

/**
 * Verifies the submitted word against the word stored
 * in the user's object in the firebase lobby
 * @returns {String}
 *   the generated word
 */

const verifyWord = async (lid, uid, submittedWord, socket) => {
  firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value').then((snapshot) => {
    const currWord = snapshot.val().word;
    socket.emit('verifyWord', { isCorrect: currWord === submittedWord });
  });
};

/**
 * Adds a point for the user at the lobby/${lid}/users/${uid} endpoint
 * @param {String} uid
 *   the uid of the user that deserves a point
 * @param {String} lid
 *   the lid of the lobby that the user is in
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


module.exports = {
  sendWord,
  verifyWord,
  addPoint,
  removePoint,
  getWord,
};
