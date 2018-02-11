const firebase = require('../fire');
const { createUser, removeUser } = require('../modules/user');

describe('Tests for user module', () => {
  it('should create a user in the firebase database', () => {
    const dummyId = 'create-user-test-id';
    createUser(dummyId, 'create-user-test');
    // TODO: check that the user was actually created on firebase

    firebase.ref(`users/${dummyId}`).remove();
  });

  it('should remove a user in the firebase database', () => {
    const dummyId = 'remove-user-test-id';

    // Add a dummy user to remove
    firebase.ref(`users/${dummyId}`).set({
      username: 'remove-user-test',
    });

    removeUser(dummyId);

    // TODO: check that the user was actually removed on firebase
  });

  it('should fail to remove an non-existant user without error', () => {
    // TODO
  });
});
