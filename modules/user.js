const firebase = require('../fire');

/**
 * Creates a new entry at the /users/:id firebase endpoint with the given username
 * @param {String} uid
 *   the unique id that identifies the user in our database
 * @param {String} username
 *   the in game name the user has chosen
 */
const createUser = (uid, username) => {
  firebase.ref(`users/${uid}`).set({
    username,
  });
};

const removeUser = (uid) => {
  firebase.ref(`users/${uid}`).remove();
};

module.exports = {
  createUser,
  removeUser,
};
