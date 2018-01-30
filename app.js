const express  = require('express');
const socketio = require('socket.io');
const http     = require('http');

// initialize the server
const app    = express();
const server = http.createServer(app);
const io     = socketio(server);

// initialize socket handler
io.on('connection', (socket) => onConnection(socket));

const onConnection = (socket) => {
  // runs whenever a new client connects
  console.log('New client has connected');

  // client disconnect handler
  socket.on('disconnect', () => console.log('Client has disconnected'));
};

const port = process.env.PORT || 8000;
server.listen(port, () => console.log('Service is up at http://localhost:' + port));

