const randomWords = require('random-words');

/**
 * Generates a random word
 * @returns {String}
 *   the generated word
 */
const getWord = () => randomWords();

module.exports = {
  getWord,
};
