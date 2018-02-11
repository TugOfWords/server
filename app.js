const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// import the modules
const { createUser, removeUser } = require('./modules/user');
const { createRoom } = require('./modules/room');
const { getWord } = require('./modules/game');

// initialize the server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

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

  socket.on('sendWord', () => console.log(getWord()));

  socket.on('disconnect', () => console.log('Client has disconnected'));

  // create new user handler
  socket.on('createUser', data => createUser(data.uid, data.username));

  // remove user from database
  socket.on('removeUser', data => removeUser(data.uid));

  // create new room handler
  socket.on('createRoom', data => createRoom(data.rid));
};

// initialize socket handler
io.on('connection', socket => onConnection(socket));

const port = process.env.PORT || 8000;
const runner = server.listen(port, () => console.log(`Service is up at http://localhost:${port}`));

module.exports = runner;
