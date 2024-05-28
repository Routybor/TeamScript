import io from 'socket.io-client';

// const host = 'http://147.45.158.226';
const host = 'http://localhost:5000';
const socket = io(host);

const config = {
    host,
    socket,
};

export default config;
