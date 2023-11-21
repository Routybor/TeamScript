const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
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

const textRoute = require("./routes/textRoute");
const taskRoute = require("./routes/taskRoute");
const authRoute = require("./routes/authRoute");

app.use('/text', textRoute);
app.use('/project', taskRoute);
app.use('/auth', authRoute)

server.listen(port, () => {
    console.log(`Backend link is = http://localhost:${port}`);
});
