const assert = require('assert');
const firebase = require('../fire');
const { createRoom } = require('../modules/room');

describe('Tests for room module', () => {
  it('should create a room in the firebase database', () => {
    const dummyId = 'create-room-test-id';
    createRoom(dummyId, 'some-id');
    const currRoom = firebase.ref(`rooms/${dummyId}`);
    if (!currRoom) {
      assert(null);
    }
    firebase.ref(`rooms/${dummyId}`).remove();
  });

  it('should remove a room in the firebase database', () => {
    const dummyId = 'remove-room-test-id';

    // Add a dummy room to remove
    firebase.ref(`rooms/${dummyId}`).set({
      username: 'remove-room-test',
    });
    firebase.ref(`rooms/${dummyId}`).remove();
  });
});
