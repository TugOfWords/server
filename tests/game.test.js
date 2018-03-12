const assert = require('assert');
const firebase = require('../fire');
const { getWord, whichTeam } = require('../modules/game');
const {
  createLobby, joinLobby, joinTeam,
} = require('../modules/lobby');
const { createUser } = require('../modules/user');

describe('Tests for game module', () => {
  const n = 1000;
  it('should create random words', () => {
    const words = [];
    let i = 0;
    while (i < n) {
      const randWord = getWord();
      words.push(randWord);
      i += 1;
    }
    let dups = 0;
    let j = 0;
    while (j < n) {
      let k = 0;
      while (k < n) {
        if (words[j] === words[k]) {
          dups += 1;
        }
        k += 1;
      }
      j += 1;
    }
    const d = (dups - n) / 2;
    const x = n * 0.01;
    if (d > x) {
      assert(null);
    }
  });

  it('should tell which team a user is in', async () => {
    const uid = 'which-lobby-test-uid';
    await createUser(uid, 'which-lobby-test-username');
    const uid2 = 'which-lobby-test-uid2';
    await createUser(uid2, 'which-lobby-test-username2');
    const uid3 = 'which-lobby-test-uid3';
    await createUser(uid3, 'which-lobby-test-username3');

    const lid = 'which-lobby-test-id';
    await createLobby(lid, uid);
    await joinLobby(lid, uid);
    await joinTeam(lid, 1, uid);

    await joinLobby(lid, uid2);
    await joinTeam(lid, 2, uid2);

    await joinLobby(lid, uid3);

    assert.strictEqual(await whichTeam(lid, uid), 1);
    assert.strictEqual(await whichTeam(lid, uid2), 2);
    assert.strictEqual(await whichTeam(lid, uid3), 0);

    firebase.ref(`users/${uid}`).remove();
    firebase.ref(`users/${uid2}`).remove();
    firebase.ref(`users/${uid3}`).remove();
    firebase.ref(`lobbys/${lid}`).remove();
  });

  // it('should add points to a certain user', async () => {
  //   const uid = 'add-point-test-uid';
  //   const lid = 'add-point-test-lid';
  //   await createUser(uid, 'add-points-test-username');
  //   await createLobby(lid, uid);
  //   await joinLobby(lid, uid);
  //   let snapshot = await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value');
  //   const bp = snapshot.val();
  //   await addPoint(lid, uid);
  //   snapshot = await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value');
  //   const ap = snapshot.val().points;
  //   // assert((ap - bp) === 1);
  //   firebase.ref(`/lobbys/${lid}`).remove();
  //   firebase.ref(`/users/${uid}`).remove();
  // });

  // it('should remove points to a certain user', async () => {
  //   const uid = 'remove-point-test-uid';
  //   const lid = 'remove-point-test-lid';
  //   createUser(uid, 'remove-points-test-username');
  //   createLobby(lid, uid);
  //   joinLobby(lid, uid);
  //   let snapshot = await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value');
  //   const bp = snapshot.val().points;
  //   await removePoint(lid, uid);
  //   snapshot = await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value');
  //   const ap = snapshot.val().points;
  //   // assert((bp - ap) === 1);
  //   firebase.ref(`/lobbys/${lid}`).remove();
  //   firebase.ref(`/users/${uid}`).remove();
  // });
});
