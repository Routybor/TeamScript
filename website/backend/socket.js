const socketIO = require("socket.io");

const configureSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
    },
  });

  return io;
};

module.exports = configureSocket;
