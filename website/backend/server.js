const express = require("express");
const http = require("http");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require("cors");
const RateLimit = require('express-rate-limit');

// Rate limiter to prevent abuse
const limiter = RateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 50000, // limit each IP to 50000 requests per windowMs
});
const app = express();
const port = 5000;
const server = http.createServer(app);

// Socket.io for real-time communication
const socket = require("./socket");
socket.configureSocket(server);

// Middleware setup
app.use(cors());
app.use(limiter);
app.use(bodyParser.json());

// Router setup
const projectRouter = require("./router/projectRouter");
const taskRouter = require("./router/taskRouter");
const authRouter = require("./router/authRouter");
const rowRouter = require("./router/rowRouter");

// const textRouter = require("./router/textRouter");
// app.use('/text', textRouter);

// Mount routers
app.use('/project', projectRouter)
app.use('/taskboard', taskRouter);
app.use('/auth', authRouter)
app.use('/row', rowRouter)

// Initialize database tables
const checkTablesExistence = require("./database/initDataBase");

// Start the server
server.listen(port, () => {
    console.log(`Backend link is = http://localhost:${port}`);
});
