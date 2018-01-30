const assert = require('assert');
const io = require('socket.io-client');

const ioOptions = {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false,
};


let server;
describe('Server', () => {
  beforeEach((done) => {
    server = require('../app'); // eslint-disable-line global-require
    if (!server) assert(null);
    done();
  });

  it('should run without crashing', () => {
    io.connect('http://localhost:8000', ioOptions);
  });
});

