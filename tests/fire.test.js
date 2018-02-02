const assert = require('assert');
const fire = require('../fire');

describe('Database', () => {
  it('should connect to the firebase real-time database', () => {
    assert(fire);
  });
});
