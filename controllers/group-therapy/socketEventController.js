const rooms = {};
const socketEvents = (socket) => {
  socket.on('create-room', (roomId, peerId) => {
    rooms[socket.id] = roomId;
    socket.join(roomId);
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnect', peerId);
      delete rooms[socket.id];
    });
  });
  socket.on('join-room', (roomId, peerId) => {
    const roomExist = Object.values(rooms).includes(roomId);
    if (roomExist) {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', peerId);
      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnect', peerId);
      });
    } else {
      socket.emit('no-room', roomId);
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
