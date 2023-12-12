import io from 'socket.io-client';

const host = 'http://localhost:5000';
const socket = io(host);

const config = {
    host,
    socket,
};

export default config;
