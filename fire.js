const firebase = require('firebase');

const config = {
  apiKey: 'AIzaSyBruBNPWwCaSw-zUqlZNxYnQ-uHBH7z7Cs',
  authDomain: 'tug-of-words.firebaseapp.com',
  databaseURL: 'https://tug-of-words.firebaseio.com',
  projectId: 'tug-of-words',
  storageBucket: 'tug-of-words.appspot.com',
  messagingSenderId: '874967513988',
};

firebase.initializeApp(config);

module.exports = firebase.database();
