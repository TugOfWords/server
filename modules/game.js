const randomWords = require('random-words');
const firebase = require('../fire');

/**
 * Generates a random word
 * @returns {String}
 *   the generated word
 */
const getWord = () => randomWords();

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
  getWord,
  addPoint,
  removePoint,
};
