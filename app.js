const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const firebase = require('./fire');

// modules
const user = require('./modules/user');
const lobby = require('./modules/lobby');
const game = require('./modules/game');

// initialize the server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(bodyParser.json());
app.use('/lobbys', lobby.lobbyRouter);
app.use('/users', user.userRouter);


/**
* Connection handler for the websocket
* @param {Object} socket
*   the communication channel between the client and the server
*/
const onConnection = (socket) => {
  const lid = socket.request._query.id;
  console.log(`Connection established for lobby: ${lid}`); // eslint-disable-line no-underscore-dangle

  /* LOBBY */
  socket.on('joinLobby', data => lobby.joinLobby(data.lid, data.uid));
  socket.on('leaveLobby', (data) => {
    lobby.leaveLobby(data.lid, data.uid);
    socket.disconnect();
  });
  socket.on('joinTeam', (data) => {
    lobby.joinTeam(data.lid, data.teamNumber, data.uid);
  });
  socket.on('leaveTeam', data => lobby.leaveTeam(data.lid, data.uid));

  /* GAME */
  socket.on('sendWord', data => game.sendWord(data.lid, data.uid, data.submittedWord, socket));
  socket.on('verifyWord', data => game.verifyWord(data.lid, data.uid, data.submittedWord, socket));
  socket.on('removePoint', data => game.removePoint(data.uid));
  socket.on('addPoint', data => game.addPoint(data.uid));
};

/**
* Connection middleware for checking lobby id.
* @param {Object} socket
*   the communication channel between the client and the server
* @param {Object} next
*   go to the next middlware
*/
const checkConnect = (socket, next) => {
  console.log('checking connection...');
  const lid = socket.request._query.id;
  if (lid === undefined) {
    console.log('Connection denied: No lobby id specified.');
    socket.disconnect();
  } else {
    // validate that the room exists
    firebase.ref(`/lobbys/${lid}`).once('value')
      .then((snapshot) => {
        const exists = (snapshot.val() !== null);
        if (exists) next();
        console.log(`Lobby ${lid} does not exist`);
      });
  }
};

io.use(checkConnect);
io.on('connection', socket => onConnection(socket));

const port = process.env.PORT || 8000;
const runner = server.listen(port, () => console.log(`Service is up at http://localhost:${port}`));

module.exports = runner;
