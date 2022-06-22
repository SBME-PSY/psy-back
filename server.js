const dotenv = require('dotenv');
const morgan = require('morgan');

// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const peer = require('peer');
const app = require('./app');
const { socketEvents } = require('./controllers');

dotenv.config({ path: './config/config.env' });
const connectDB = require('./config/db');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

connectDB();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POSt'],
  })
);
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
  },
});
io.on('connection', socketEvents);
const peerPort = process.env.PEERPORT || 9000;
const { PeerServer } = peer;
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
