const firebase = require('../fire');
const { createRoom } = require('../modules/room');

describe('Tests for room module', () => {
  it('should create a room in the firebase database', () => {
    const dummyId = 'create-room-test-id';
    createRoom(dummyId, 'some-id');
    // TODO: assert that the room has actually been added to firebase

    firebase.ref(`rooms/${dummyId}`).remove();
  });
});
