const randomWords = require('rword');
const firebase = require('../fire');

/**
 * Generates a random word
 * @returns {String}
 *   the generated word
 */
const sendWord = (rid, uid, socket) => {
  const randWord = randomWords.generate();
  const ref = firebase.ref(`room/${rid}/users/${uid}`);
  ref.set({ word: randWord });
  socket.emit('sendWord', { newWord: randWord });
};

/**
 * Verifies the submitted word against the word stored
 * in the user's object in the firebase room
 * @returns {String}
 *   the generated word
 */

const verifyWord = (rid, uid, submittedWord, socket) => {
  firebase.ref(`room/${rid}/users/${uid}`).once('value').then((snapshot) => {
    const currWord = snapshot.val().word;
    socket.emit('verifyWord', { isCorrect: currWord === submittedWord });
  });
};

/**
 * Adds a point for the user at the users/{uid} endpoint
 * @param {String} uid
 *   the uid of the user that deserves a point
 */
const addPoint = (uid) => {
  const ref = firebase.ref(`users/${uid}/points`);
  ref.transaction(currPoints => (currPoints || 0) + 1);
};

/**
 * Removes a point for the user at the users/{uid} endpoint
 * @param {String} uid
 *   the uid of the user that deserves a point
 */
const removePoint = (uid) => {
  const ref = firebase.ref(`users/${uid}/points`);
  ref.transaction(currPoints => (currPoints || 0) - 1);
};


module.exports = {
  sendWord,
  verifyWord,
  addPoint,
  removePoint,
};
