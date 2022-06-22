const socketEvents = (socket) => {
  console.log('socket connected');
  socket.on('join-room', (roomId, peerId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', peerId);
    socket.on('disconnect', () => {
      console.log('socket disconnected');
      socket.to(roomId).emit('user-disconnect', peerId);
    });
  });
};
module.exports = socketEvents;
