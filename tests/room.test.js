const assert = require('assert');
const firebase = require('../fire');
const { createLobby } = require('../modules/lobby');

describe('Tests for lobby module', () => {
  it('should create a lobby in the firebase database', () => {
    const dummyId = 'create-lobby-test-id';
    createLobby(dummyId, 'some-id');
    const currLobby = firebase.ref(`lobbys/${dummyId}`);
    if (!currLobby) {
      assert(null);
    }
    firebase.ref(`lobbys/${dummyId}`).remove();
  });

  it('should remove a lobby in the firebase database', () => {
    const dummyId = 'remove-lobby-test-id';

    // Add a dummy lobby to remove
    firebase.ref(`lobbys/${dummyId}`).set({
      username: 'remove-lobby-test',
    });
    firebase.ref(`lobbys/${dummyId}`).remove();
  });
});
