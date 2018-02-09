const firebase = require('../fire');

/**
 * Creates a new entry at the /rooms/:id firebase endpoint with the given roomname
 * @param {String} rid
 *   the unique id that identifies the room in our database
 */
const createRoom = (rid) => {
  firebase.ref(`rooms/${rid}`).set({
    active: true,
  });
};

module.exports = {
  createRoom,
};
