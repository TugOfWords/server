const assert = require('assert');
const firebase = require('../fire');
const {
  createLobby, removeLobby, joinLobby, leaveLobby, joinTeam, leaveTeam,
} = require('../modules/lobby');
const { createUser } = require('../modules/user');

describe('Tests for lobby module', async () => {
  it('should create a lobby in the firebase database', () => {
    const lid = 'create-lobby-test-id';
    createLobby(lid, 'some-id');
    const currLobby = firebase.ref(`lobbys/${lid}`);
    if (!currLobby) {
      assert(null);
    }
    firebase.ref(`lobbys/${lid}`).remove();
  });

  it('should remove a lobby in the firebase database', async () => {
    const uid = 'remove-lobby-test-uid';
    createUser(uid, 'remove-lobby-test-username');
    const lid = 'remove-lobby-test-id';
    createLobby(lid, uid);
    if (!removeLobby(lid)) {
      assert(null);
    }
    firebase.ref(`users/${uid}`).remove();
    firebase.ref(`lobbys/${lid}`).remove();
  });

  it('should allow users to join a lobby', async () => {
    const uid = 'join-lobby-test-uid';
    createUser(uid, 'join-lobby-test-username');
    const uid2 = 'join-lobby-test-uid2';
    createUser(uid2, 'join-lobby-test-username2');
    const lid = 'join-lobby-test-id';
    createLobby(lid, uid);
    if (!joinLobby(lid)) {
      assert(null);
    }
    firebase.ref(`users/${uid}`).remove();
    firebase.ref(`users/${uid2}`).remove();
    firebase.ref(`lobbys/${lid}`).remove();
  });

  it('should allow users to leave a lobby', async () => {
    const uid = 'leave-lobby-test-uid';
    createUser(uid, 'leave-lobby-test-username');
    const uid2 = 'leave-lobby-test-uid2';
    createUser(uid2, 'leave-lobby-test-username2');
    const lid = 'leave-lobby-test-id';
    createLobby(lid, uid);
    if (!leaveLobby(lid)) {
      assert(null);
    }
    removeLobby(lid);
    firebase.ref(`lobbys/${lid}`).remove();
    firebase.ref(`users/${uid}`).remove();
    firebase.ref(`users/${uid2}`).remove();
  });

  it('should allow users to join a team', async () => {
    const uid = 'join-team-test-uid';
    createUser(uid, 'join-team-test-username');
    const lid = 'join-team-test-id';
    createLobby(lid, uid);
    joinLobby(lid, uid);
    joinTeam(lid, 1, uid);
    await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value').then((snap) => {
      if (!snap.val()) {
        assert(null);
      }
    });
    removeLobby(lid);
    firebase.ref(`lobbys/${lid}`).remove();
    firebase.ref(`users/${uid}`).remove();
  });

  it('should allow users to leave a team', async () => {
    const uid = 'leave-team-lobby-test-uid';
    createUser(uid, 'leave-team-test-username');
    const lid = 'leave-team-test-id';
    createLobby(lid, uid);
    joinLobby(lid, uid);
    joinTeam(lid, 1, uid);
    leaveTeam(lid, uid);
    await firebase.ref(`/lobbys/${lid}/t1/${uid}`).once('value').then((snap) => {
      if (snap.val()) {
        assert(null);
      }
    });
    firebase.ref(`/lobbys/${lid}/t2/${uid}`).once('value').then((snap2) => {
      if (snap2.val()) {
        assert(null);
      }
    });
    firebase.ref(`users/${uid}`).remove();
    firebase.ref(`lobbys/${lid}`).remove();
  });
});
