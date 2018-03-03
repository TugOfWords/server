const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

// import the modules
const {
  createLobby, lobbyRouter, removeLobby, joinTeam,
} = require('./modules/lobby');
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
app.use('/lobbys', lobbyRouter);
app.use('/users', userRouter);

/**
* Connection middleware for checking lobby id.
* @param {Object} socket
*   the communication channel between the client and the server
* @param {Object} next
*   go to the next middlware
*/
const checkConnect = (socket, next) => {
  if (socket.request._query.id === undefined) {
    console.log('Connection denied: No lobby id specified.');
    socket.disconnect();
  } else {
    next();
  }
};

/**
* Connection handler for the websocket
* @param {Object} socket
*   the communication channel between the client and the server
*/
const onConnection = (socket) => {
  const lid = socket.request._query.id;
  console.log(`Connection established for lobby: ${lid}`); // eslint-disable-line no-underscore-dangle

  socket.on('sendWord', data => sendWord(data.lid, data.uid, data.submittedWord, socket)); // need to emit the socket event

  socket.on('verifyWord', data => verifyWord(data.lid, data.uid, data.submittedWord, socket));


  socket.on('disconnect', () => {
    removeLobby(lid);
  });

  // create new user handler
  socket.on('createUser', data => createUser(data.uid, data.username));

  // remove user from database
  socket.on('removeUser', data => removeUser(data.uid));

  // create new lobby handler
  socket.on('createLobby', data => createLobby(data.lid));

  socket.on('joinTeam', (data) => {
    console.log(data);
    joinTeam(data.team, data.uid, lid);
    socket.join(lid);
  });
  // remove a point for a user
  socket.on('removePoint', data => removePoint(data.uid));

  // add a point for a user
  socket.on('addPoint', data => addPoint(data.uid));
};

io.use(checkConnect);
// initialize socket handler
io.on('connection', socket => onConnection(socket));

const port = process.env.PORT || 8000;
const runner = server.listen(port, () => console.log(`Service is up at http://localhost:${port}`));

module.exports = runner;
