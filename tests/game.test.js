const assert = require('assert');
const firebase = require('../fire');
const { getWord, addPoint, removePoint } = require('../modules/game');
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
    const x = n * 0.005;
    if (d > x) {
      assert(null);
    }
  });

  it('should add points to certain user', () => {
    const dummyId = 'add-point-test-user-id';
    createUser(dummyId, 'add-point-test-user');
    return firebase.ref(`users/${dummyId}`).once('value').then((snapshot) => {
      const bPoints = snapshot.val().points;
      addPoint(dummyId);
      return firebase.ref(`users/${dummyId}`).once('value').then((snapshot2) => {
        const aPoints = snapshot2.val().points;
        if ((aPoints - bPoints) !== 1) {
          assert(null);
        }
        firebase.ref(`users/${dummyId}`).remove();
      });
    });
  });

  it('should remove points to certain user', () => {
    const dummyId = 'remove-point-test-user-id';
    createUser(dummyId, 'remove-point-test-user');
    return firebase.ref(`users/${dummyId}`).once('value').then((snapshot) => {
      const bPoints = snapshot.val().points;
      removePoint(dummyId);
      return firebase.ref(`users/${dummyId}`).once('value').then((snapshot2) => {
        const aPoints = snapshot2.val().points;
        if ((bPoints - aPoints) !== 1) {
          assert(null);
        }
        firebase.ref(`users/${dummyId}`).remove();
      });
    });
  });
});

