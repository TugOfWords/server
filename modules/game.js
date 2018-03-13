const randomWords = require('rword');
const firebase = require('../fire');

/**
 * Generates a random words for test suite
 */
const getWord = () => randomWords.generate();

/**
 * Generates a random word
 * @returns {String}
 *   the generated word
 */
const sendWord = async (lid, uid) => {
  const randWord = randomWords.generate();
  const ref = await firebase.ref(`/lobbys/${lid}/users/${uid}`);
  ref.update({ word: randWord });
  return randWord;
};

/**
 * Verifies the submitted word against the word stored
 * in the user's object in the firebase lobby
 * @returns {String}
 *   the generated word
 */

const verifyWord = async (lid, uid, submittedWord) => {
  let currWord = '';
  await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value').then((snapshot) => {
    currWord = snapshot.val().word;
  });
  return currWord === submittedWord;
};

const getScore = async lid => ({
  t1: (await firebase.ref(`/lobbys/${lid}`).once('value')).val().t1Score,
  t2: (await firebase.ref(`/lobbys/${lid}`).once('value')).val().t2Score,
});

const getUserScore = async (lid, uid) => ({
  score: (await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value')).val().points,
});

const whichTeam = async (lid, uid) => {
  let t1 = false;
  let t2 = false;

  await firebase.ref(`/lobbys/${lid}/t1/${uid}`).once('value').then((snap) => {
    t1 = snap.exists();
  });

  await firebase.ref(`/lobbys/${lid}/t2/${uid}`).once('value').then((snap) => {
    t2 = snap.exists();
  });

  if (!t1 && !t2) return 0;
  return t1 ? 1 : 2;
};

const changePoints = async (lid, uid, diff) => {
  await firebase.ref(`/lobbys/${lid}/users/${uid}`).once('value').then((snap) => {
    const bp = snap.val().points;
    firebase.ref(`/lobbys/${lid}/users/${uid}`).update({
      points: bp + diff,
    });
  });
  const team = await whichTeam(lid, uid);
  if (team === 1) {
    firebase.ref(`/lobbys/${lid}`).once('value').then((snap) => {
      const t1Score = snap.val().t1Score + diff;
      firebase.ref(`/lobbys/${lid}`).update({
        t1Score,
      });
    });
  } else if (team === 2) {
    firebase.ref(`/lobbys/${lid}`).once('value').then((snap) => {
      const t2Score = snap.val().t2Score + diff;
      firebase.ref(`/lobbys/${lid}`).update({
        t2Score,
      });
    });
  }
};

const endGame = async (lid) => {
  firebase.ref(`/lobbys/${lid}`).update({
    active: false,
    gameplay: false,
  });
  const lb = (await firebase.ref(`/lobbys/${lid}`).once('value')).val();
  const end = {};
  end.t1 = {};
  const entries1 = Object.entries(lb.t1);
  for (let i = 0; i < entries1.length; i += 1) {
    const entry = entries1[i];
    end.t1[entry[1].username] = lb.users[entry[0]].points;
  }
  end.t2 = {};
  const entries2 = Object.entries(lb.t2);
  for (let i = 0; i < entries2.length; i += 1) {
    const entry = entries2[i];
    end.t2[entry[1].username] = lb.users[entry[0]].points;
  }
  end.t1Score = lb.t1Score;
  end.t2Score = lb.t2Score;
  end.winner = lb.t1Score > lb.t2Score ? 1 : 2;

  // firebase.ref(`/lobbys/${lid}`).remove();
  return end;
};

/**
 * Adds a point for the user at the lobby/${lid}/users/${uid} endpoint
 * @param {String} uid
 *   the uid of the user that deserves a point
 * @param {String} lid
 *   the lid of the lobby that the user is in
 *
 * unit test exists
 */
const addPoint = async (lid, uid) => {
  await changePoints(lid, uid, 1);
};

/**
 * Removes a point for the user at the lobby/${lid}/users/${uid} endpoint
 * @param {String} uid
 *   the uid of the user that deserves a point
 * @param {String} lid
 *   the lid of the lobby that the user is in
 *
 *  unit test exists
 */
const removePoint = async (lid, uid) => {
  await changePoints(lid, uid, -1);
};

module.exports = {
  sendWord,
  verifyWord,
  addPoint,
  removePoint,
  getWord,
  whichTeam,
  getScore,
  getUserScore,
  endGame,
};
