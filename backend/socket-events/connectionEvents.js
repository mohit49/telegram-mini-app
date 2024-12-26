module.exports = (socket) => {
    console.log("msgsent")
    socket.emit('message', 'Welcome to the Socket.IO server!');
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  };