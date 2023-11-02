// ------------------------- IMPORT SETION ---------------------------
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const port = 5000;
const server = http.createServer(app);
const RateLimit = require('express-rate-limit');

// ------------------------- DOTENV SETION ---------------------------
dotenv.config({ path: "../../.env" });
const pgUser = process.env.PGUSER;
const pgPassword = process.env.PGPASSWORD;
const pgHost = process.env.PGHOST;
const pgPort = process.env.PGPORT;
const pgDatabase = process.env.PGDATABASE;
const pgSsl = process.env.PGSSL === "true";

// ------------------------- MAIN SETION ---------------------------
const limiter = RateLimit({
  windowMs: 60 * 1000,
  max: 50000,
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const pool = new Pool({
  user: pgUser,
  password: pgPassword,
  host: pgHost,
  port: pgPort,
  database: pgDatabase,
  ssl: pgSsl,
});

app.use(cors());
app.use(limiter);
app.use(bodyParser.json());

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL db");
  })
  .catch((error) => {
    console.error("Error connecting to PostgreSQL db = ", error);
  });

const sendTextToClients = (newText) => {
  io.emit('updateText', { text_column: newText });
};

const sendStateToClients = (task_id, task_state) => {
  io.emit('updateTask', { taskID: task_id, CurState: task_state });
};


// ------------------------- TEXT SETION ---------------------------
app.get('/database', (req, res) => {
  pool.query('select text_column from text_table', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.post('/database/saveText', (req, res) => {
  const newText = req.body.textField;
  pool.query(`UPDATE text_table SET text_column = '${newText}' WHERE id = 1 `, (err, result) => {
    if (!err) {
      sendTextToClients(newText);
      res.json({ text_column: newText });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    }
  });
});

// ------------------------- TASK SETION ---------------------------
app.get('/project/tasks', (req, res) => {
  pool.query('select * from user_tasks ', (err, result) => {
    if (!err) {
      res.json(result.rows);
    } else {
      console.error(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    }
  });
});

app.post('/project/createTask', (req, res) => {
  const newTaskName = req.body.taskName;
  const newState = req.body.newState;
  pool.query(`INSERT INTO user_tasks(taskname, curstate) values($1, $2)`, [newTaskName, newState], (err, result) => {
    if (!err) {
      res.json({
        Taskname: newTaskName,
        CurState: newState
      });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    }
  });
});

app.post('/project/changeState', (req, res) => {
  const taskId = req.body.taskID;
  const newState = req.body.newState;
  pool.query(`UPDATE user_tasks SET curstate = $1 WHERE id = $2`, [newState, taskId], (err, result) => {
    if (!err) {
      sendStateToClients(taskId, newState);
      res.json({
        taskID: taskId,
        CurState: newState
      });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    }
  });
});

app.post('/project/deleteTask', (req, res) => {
  const taskId = req.body.taskID;
  pool.query('DELETE FROM user_tasks WHERE id = $1', [taskId], (err, result) => {
    if (!err) {
      //TODO добавить синхронизацию
    } else {
      console.log(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    }
  });
});

// ------------------------- RUNSERVER SETION ---------------------------
server.listen(port, () => {
  console.log(`Backend link is = http://localhost:${port}`);
});