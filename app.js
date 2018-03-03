const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

// import the modules
const { createRoom, roomRouter, removeRoom, joinTeam } = require('./modules/room');
const { createUser, removeUser, userRouter } = require('./modules/user');
const { getWord } = require('./modules/game');

// initialize the server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(bodyParser.json());
app.use('/rooms', roomRouter);
app.use('/users', userRouter);

/**
* Connection middleware for checking room id.
* @param {Object} socket
*   the communication channel between the client and the server
* @param {Object} next
*   go to the next middlware
*/
const checkConnect = (socket, next) => {
  if (socket.request._query.id === undefined) { // eslint-disable-line no-underscore-dangle
    console.log('Connection denied: No room id specified.');
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
  let rid = socket.request._query.id;
  console.log(`Connection established for room: ${rid}`); // eslint-disable-line no-underscore-dangle

  socket.on('sendWord', () => console.log(getWord()));

  socket.on('disconnect', () => {
    removeRoom(rid);
  });

  // create new user handler
  socket.on('createUser', data => createUser(data.uid, data.username));

  // remove user from database
  socket.on('removeUser', data => removeUser(data.uid));

  // create new room handler
  socket.on('createRoom', data => createRoom(data.rid));

  socket.on('joinTeam', data => {
    console.log(data);
    joinTeam(data.team, data.uid, rid);
    socket.join(rid);
  });

};

io.use(checkConnect);
// initialize socket handler
io.on('connection', socket => onConnection(socket));

const port = process.env.PORT || 8000;
const runner = server.listen(port, () => console.log(`Service is up at http://localhost:${port}`));

module.exports = runner;
