const firebase = require('firebase');

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'tug-of-words.firebaseapp.com',
  databaseURL: 'https://tug-of-words.firebaseio.com',
  projectId: 'tug-of-words',
  storageBucket: 'tug-of-words.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};

firebase.initializeApp(config);

module.exports = firebase.database();
