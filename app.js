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
  const countdowns = {};
  const startTime = 60; // public lobby wait time (seconds)
  socket.join(lid);

  /* LOBBY */
  socket.on('joinLobby', async (data) => {
    if (data.isPrivate) {
      if (lobby.joinLobby(data.lid, data.uid)) {
        const teams = await lobby.getTeams(data.lid);
        io.sockets.emit(`user joined lobby ${data.lid}`, teams);
      }
    } else {
      lobby.joinPublicLobby(data.uid);
      const teams = await lobby.getTeams(data.lid);
      io.sockets.emit(`user joined lobby ${data.lid}`, teams);
      io.sockets.emit(`user joined team ${data.lid}`, teams);
      const lenT1 = Object.keys(teams.t1).length;
      const lenT2 = Object.keys(teams.t2).length;
      if (lenT1 === 1 && lenT2 === 1) {
        // start a lobby countdown
        io.sockets.emit(`start countdown ${data.lid}`, { seconds: startTime });
        try {
          clearInterval(countdowns[data.lid].timer);
        } catch (e) {
          // do nothing
        }
        countdowns[data.lid] = {
          seconds: startTime,
          timer: setInterval(() => {
            countdowns[data.lid].seconds -= 1;
            io.sockets.emit(`countdown ${data.lid}`, { seconds: countdowns[data.lid].seconds });
            if (countdowns[data.lid].seconds === 0) { // countdown has ended
              clearInterval(countdowns[data.lid].timer);
              io.sockets.emit(`finish countdown ${data.lid}`);
            }
          }, 1000),
        };
      }
    }
  });
  socket.on('leaveLobby', async (data) => {
    lobby.leaveLobby(data.lid, data.uid);
    const teams = await lobby.getTeams(data.lid);
    io.sockets.emit(`user left lobby ${data.lid}`, teams);
    // check if we need to stop a timer
    if (data.lid.substr(0, 2) === 'p_') {
      const lenT1 = Object.keys(teams.t1).length;
      const lenT2 = Object.keys(teams.t2).length;
      if (lenT1 === 0 || lenT2 === 0) {
        io.sockets.emit(`stop countdown ${data.lid}`);
        try {
          clearInterval(countdowns[data.lid].timer);
        } catch (e) {
          // do nothing
        }
      }
    }
    socket.disconnect();
  });
  socket.on('joinTeam', async (data) => {
    if (lobby.joinTeam(data.lid, data.teamNumber, data.uid)) {
      const teams = await lobby.getTeams(data.lid);
      io.sockets.emit(`user joined team ${data.lid}`, teams);
      // check if we need to start a timer for a public lobby
    }
  });
  socket.on('leaveTeam', (data) => {
    if (lobby.leaveTeam(data.lid, data.uid)) {
      io.sockets.emit(`user left team ${data.lid}`, { message: 'from leaveTeam' });
    }
  });
  socket.on('getTeams', async (data) => {
    const teams = await lobby.getTeams(data.lid);
    io.sockets.emit(`got teams ${lid}`, teams);
  });

  socket.on('startGame', async () => {
    io.to(lid).emit('startGame');
  });

  /* GAME */
  socket.on('sendWord', data => socket.emit('sendWord', { newWord: game.sendWord(data.lid, data.uid, data.submittedWord) }));
  socket.on('verifyWord', data => socket.emit('verifyWord', { isCorrect: game.verifyWord(data.lid, data.uid, data.submittedWord) }));
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
const checkConnect = async (socket, next) => {
  const lid = socket.request._query.id;
  if (lid === undefined) {
    console.log('Connection denied: No lobby id specified.');
    socket.disconnect();
  } else {
    const lobbyRef = await firebase.ref(`/lobbys/${lid}`).once('value');
    const exists = (lobbyRef.val() !== null);
    if (exists) {
      const usersRef = await firebase.ref(`/lobbys${lid}/users`).once('value');
      if (Object.keys(usersRef).length < 50) next();
      else console.log(`Lobby ${lid} is full`);
    } else {
      console.log(`Lobby ${lid} does not exist`);
    }
  }
};

io.use(checkConnect);
io.on('connection', socket => onConnection(socket));

const port = process.env.PORT || 8000;
const runner = server.listen(port, () => console.log(`Service is up at http://localhost:${port}`));

module.exports = runner;
