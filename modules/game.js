const randomWords = require('random-words');

const getWord = () => randomWords();

module.exports = {
  getWord,
};
