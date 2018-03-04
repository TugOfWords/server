const assert = require('assert');
// const firebase = require('../fire');
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
    const x = n * 0.005;
    if (d > x) {
      assert(null);
    }
  });

  // it('should add points to certain user', () => {
  //   const dummyUid = 'add-point-test-user-id';
  //   const dummyLid = 'add-point-test-lobby-id';
  //   createUser(dummyUid, 'add-point-test-user');
  //   createLobby(dummyLid, dummyUid);
  //   joinLobby(dummyLid, dummyUid);
  //   return firebase.ref(`/lobbys/${dummyLid}/users/${dummyUid}`).once
  // ('value').then((snapshot) => {
  //     const bPoints = snapshot.val().points;
  //     addPoint(dummyLid, dummyUid);
  //     return firebase.ref(`/lobbys/${dummyLid}/users/${dummyUid}`).once
  // ('value').then((snapshot2) => {
  //       const aPoints = snapshot2.val().points;
  //       console.log(aPoints);
  //       console.log(bPoints);
  //       if ((aPoints - bPoints) !== 1) {
  //         assert(null);
  //       }
  //       firebase.ref(`users/${dummyUid}`).remove();
  //       firebase.ref(`lobby/${dummyLid}`).remove();
  //     });
  //   });
  // });
  //
  // it('should remove points to certain user', () => {
  //   const dummyUid = 'remove-point-test-user-id';
  //   const dummyLid = 'remove-point-test-lobby-id';
  //   createUser(dummyUid, 'remove-point-test-user');
  //   createLobby(dummyLid, dummyUid);
  //   joinLobby(dummyLid, dummyUid);
  //   return firebase.ref(`/lobbys/${dummyLid}/users/${dummyUid}`).once
  // ('value').then((snapshot) => {
  //     const bPoints = snapshot.val().points;
  //     removePoint(dummyLid, dummyUid);
  //     return firebase.ref(`/lobbys/${dummyLid}/users/${dummyUid}`).once
  // ('value').then((snapshot2) => {
  //       const aPoints = snapshot2.val().points;
  //       console.log(aPoints);
  //       console.log(bPoints);
  //       if ((bPoints - aPoints) !== 1) {
  //         assert(null);
  //       }
  //       firebase.ref(`users/${dummyUid}`).remove();
  //       firebase.ref(`users/${dummyLid}`).remove();
  //     });
  //   });
  // });
});
