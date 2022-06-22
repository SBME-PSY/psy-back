const dotenv = require('dotenv');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const peer = require('peer');

const app = require('./app');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
  },
});
dotenv.config({ path: './config/config.env' });
const connectDB = require('./config/db');

connectDB();
const { PeerServer } = peer;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POSt'],
  })
);

io.on('connection', (socket) => {
  console.log('socket connected');
  socket.on('join-room', (roomId, peerId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', peerId);
    socket.on('disconnect', () => {
      console.log('socket disconnected');
      socket.to(roomId).emit('user-disconnect', peerId);
    });
  });
});
const peerPort = process.env.PEERPORT || 9000;
const peerServer = PeerServer({ port: peerPort, path: '/myapp' });
peerServer.on('connection', (client) => {
  console.log('client connected ');
});
peerServer.on('disconnect', (client) => {
  console.log('client disconnected ');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`.yellow.bold));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit
  server.close(() => process.exit(1));
});

module.exports = server;
