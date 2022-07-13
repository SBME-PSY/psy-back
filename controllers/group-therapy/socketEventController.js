const rooms = {};
const socketEvents = (socket) => {
  console.log('socket connected');
  socket.on('create-room', (roomId, peerId) => {
    rooms[socket.id] = roomId;
    socket.join(roomId);
    console.log('room created');
    console.log(roomId);
    socket.on('disconnect', () => {
      console.log('socket disconnected');
      socket.to(roomId).emit('user-disconnect', peerId);
      delete rooms[socket.id];
    });
  });
  socket.on('join-room', (roomId, peerId) => {
    const roomExist = Object.values(rooms).includes(roomId);
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
  socket.on('getRooms', (arg, callBack) => {
    const roomsIds = Object.values(rooms);
    callBack(roomsIds);
  });
};
module.exports = socketEvents;
