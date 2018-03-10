const assert = require('assert');
// const firebase = require('../fire');
// const { getWord, addPoint, removePoint } = require('../modules/game');
const { getWord } = require('../modules/game');
// const { createUser } = require('../modules/user');
// const { createLobby, joinLobby } = require('../modules/lobby');

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
