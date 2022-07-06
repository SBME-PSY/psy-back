const rooms = {};
const socketEvents = (socket) => {
  console.log('socket connected');
  socket.on('create-room', (roomId) => {
    rooms[roomId] = socket.id;
    socket.join(roomId);
    console.log('room created');
    console.log(roomId);
  });
  socket.on('join-room', (roomId, peerId) => {
    const roomExist = Object.keys(rooms).includes(roomId);
    console.log('join room came ');
    if (roomExist) {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', peerId);
      socket.on('disconnect', () => {
        console.log('socket disconnected');
        socket.to(roomId).emit('user-disconnect', peerId);
      });
    } else {
      socket.emit('no-room', roomId);
      console.log('room isnt exist');
    }
  });
  socket.on('sentMessage', (message, roomId) => {
    socket.to(roomId).emit('messageCame', message);
  });
};
module.exports = socketEvents;
