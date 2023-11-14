const express = require("express");
const http = require("http");
const configureMiddlewares = require("./middlewares");
const configureSocket = require("./socket");

const textRoute = require("./routes/textRoute");
const taskRoute = require("./routes/taskRoute");

const app = express();
const port = 5000;
const server = http.createServer(app);

configureMiddlewares(app);

const io = configureSocket(server);

// TEXT
app.get('/database', textRoute.getTextFromDatabase);
app.post('/database/saveText', (req, res) => textRoute.saveTextToDatabase(req, res, io));

// TASK
app.get('/project/tasks', taskRoute.getTasksFromDatabase);
app.post('/project/createTask', (req, res) => taskRoute.createTaskInDatabase(req, res, io));
app.post('/project/changeState', (req, res) => taskRoute.changeStateInDatabase(req, res, io));
app.post('/project/deleteTask', (req, res) => taskRoute.deleteTaskFromDatabase(req, res, io));

// LAUNCH
server.listen(port, () => {
  console.log(`Backend link is = http://localhost:${port}`);
});