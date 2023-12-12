let io;

async function configureSocket(server) {
    io = require("socket.io")(server, {
        cors: {
            origin: "*",
        },
    });
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized.");
    }
    return io;
};

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

const sendTextToClients = (newText) => {
    io.emit('updateText', { text_column: newText });
};

const sendUpdateToClients = () => {
    io.emit('updateTask', {});
};

const updateProjects = () => {
    io.emit('updateProject', {});
};

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
    configureSocket,
    getIO,
    sendUpdateToClients,
    sendTextToClients,
    updateProjects,
};
