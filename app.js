const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

// import the modules
const { createRoom, roomRouter } = require('./modules/room');
const { createUser, removeUser, userRouter } = require('./modules/user');
const {
  sendWord, addPoint, removePoint, verifyWord,
} = require('./modules/game');

// initialize the server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(bodyParser.json());
app.use('/rooms', roomRouter);
app.use('/users', userRouter);

/**
* Connection handler for the websocket
* @param {Object} socket
*   the communication channel between the client and the server
*/
const onConnection = (socket) => {
  socket.on('sendWord', data => sendWord(data.rid, data.uid, data.submittedWord, socket)); // need to emit the socket event

  socket.on('verifyWord', data => verifyWord(data.rid, data.uid, data.submittedWord, socket));

  socket.on('disconnect', () => console.log('Client has disconnected'));

  // create new user handler
  socket.on('createUser', data => createUser(data.uid, data.username));

  // remove user from database
  socket.on('removeUser', data => removeUser(data.uid));

  // create new room handler
  socket.on('createRoom', data => createRoom(data.rid));

  // remove a point for a user
  socket.on('removePoint', data => removePoint(data.uid));

  // add a point for a user
  socket.on('addPoint', data => addPoint(data.uid));
};

// initialize socket handler
io.on('connection', socket => onConnection(socket));

const port = process.env.PORT || 8000;
const runner = server.listen(port, () => console.log(`Service is up at http://localhost:${port}`));

module.exports = runner;
