const assert = require('assert');
const { getWord } = require('../modules/game');

describe('Tests for game module', () => {
  it('should create random words', () => {
    const words = [];
    let i = 0;
    while (i < 100) {
      const randWord = getWord();
      console.log(randWord);
      words.push(randWord);
      i += 1;
    }
    let dups = 0;
    let j = 0;
    while (j < 100) {
      let k = 0;
      while (k < 100) {
        if (words[j] === words[k]) {
          dups += 1;
        }
        k += 1;
      }
      j += 1;
    }
    console.log(dups);
    if (dups < 100 || dups > 110) {
      assert(null);
    }
  });
});
