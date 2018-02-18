const randomWords = require('random-words');
// const firebase = require('../fire');

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
// const addPoint = (uid) => {
// let currUserPoints = firebase.ref(`users/${uid}/points`);
// const currUser = firebase.ref(`users/${uid}`);
// currUserPoints += 1;
// currUser.update({ points: points+1 });
// };

/**
 * Removes a point for the user at the users/{uid} endpoint
 * @param {String} uid
 *   the uid of the user that deserves a point
 */
// const removePoint = (uid) => {
// let currUserPoints = firebase.ref(`users/${uid}/points`);
// const currUser = firebase.ref(`users/${uid}`);
// currUserPoints -= 1;
// currUser.update({ points: currUserPoints });
// };


module.exports = {
  getWord,
  // addPoint,
  // removePoint,
};
