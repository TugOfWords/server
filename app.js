const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// initialize the server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

var randomWords = require('random-words')

/**
* Connection handler for the websocket
* @param {Object} socket
*   the communication channel between the client and the server
*/
const onConnection = (socket) => {
// client disconnect handler
  socket.on('createUser', () => {

  });

  // socket.on('joinRoom', () => {
  //   socket.join(uid);
  // });

  socket.on('sendWord', () => {
    //TODO: uncomment and send getWord()
  });

  socket.on('disconnect', () => console.log('Client has disconnected'));
};

// function getWord(){
//   return randomWords();
// }

// initialize socket handler
io.on('connection', socket => onConnection(socket));

const port = process.env.PORT || 8000;
const runner = server.listen(port, () => console.log(`Service is up at http://localhost:${port}`));

module.exports = runner;
