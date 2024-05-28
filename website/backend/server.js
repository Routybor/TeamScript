const express = require("express");
const http = require("http");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require("cors");
const RateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require("dotenv");

dotenv.config({ path: "../../.env" });

// Rate limiter to prevent abuse
const limiter = RateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 50000, // limit each IP to 50000 requests per windowMs
});

const app = express();
const port = 5000;
const host = process.env.HOST;
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

// Mount routers
app.use('/project', projectRouter)
app.use('/taskboard', taskRouter);
app.use('/auth', authRouter)
app.use('/row', rowRouter)

// Serve static files from the frontend build
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Initialize database tables
const checkTablesExistence = require("./database/initDataBase");

// Start the server
server.listen(port, () => {
    console.log(`Backend link is = http://${host}:${port}`);
});
