const io = require('socket.io')(3001, {
  cors: {
    origin: '*',
  }
});

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('join-room', (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const numClients = room ? room.size : 0;

    if (numClients < 2) {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      socket.to(roomId).emit('other-user', socket.id);
    } else {
      socket.emit('room-full', roomId);
    }
  });

  socket.on('offer', (offer, userId) => {
    socket.to(userId).emit('offer', offer, socket.id);
  });

  socket.on('answer', (answer, userId) => {
    socket.to(userId).emit('answer', answer, socket.id);
  });

  socket.on('ice-candidate', (candidate, roomId) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
