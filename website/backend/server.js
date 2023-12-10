const express = require("express");
const http = require("http");
const jwt = require('jsonwebtoken'); 
const bodyParser = require('body-parser'); 
const cors = require("cors");
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
    windowMs: 60 * 1000,
    max: 50000,
});
const app = express();
const port = 5000;
const server = http.createServer(app);
const socket = require("./socket");
socket.configureSocket(server);
app.use(cors());
app.use(limiter);
app.use(bodyParser.json());

// --------------------------------------------------------------------------------------------------
const projectRouter = require("./router/projectRouter");
// const textRouter = require("./router/textRouter");
const taskRouter = require("./router/taskRouter");
const authRouter = require("./router/authRouter");

app.use('/project', projectRouter)
// app.use('/text', textRouter);
app.use('/taskboard', taskRouter);
app.use('/auth', authRouter)

server.listen(port, () => {
    console.log(`Backend link is = http://localhost:${port}`);
});
