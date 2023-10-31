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
dotenv.config({ path: "../../.env" });
const pgUser = process.env.PGUSER;
const pgPassword = process.env.PGPASSWORD;
const pgHost = process.env.PGHOST;
const pgPort = process.env.PGPORT;
const pgDatabase = process.env.PGDATABASE;
const pgSsl = process.env.PGSSL === "true";

const limiter = RateLimit({
  windowMs: 60 * 1000,
  max: 90,
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


const sendUpdateToClients = (newText) => {
  io.emit('updateText', { text_column: newText });
};

app.post('/database/saveText', (req, res) => {
  const newText = req.body.textField;
  pool.query(`UPDATE text_table
                SET text_column = '${newText}'
                WHERE id = 1 `, (err, result) => {
    if (!err) {
      sendUpdateToClients(newText);
      res.json({ text_column: newText });
    }
  });
});

// -------код для работы с тасками---------

app.get('/project/tasks', (req, res) => {
  pool.query('select * from alltasks ', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    } else {
      res.json(result.rows);
      console.log(result.rows);
    }
  });
});

app.post('/project/createTask', (req, res) => {
  const newTaskName = req.body.taskName;
  const newstate = req.body.newState;
  console.log("Task created = %s %s", newTaskName, newstate);
  pool.query(`UPDATE alltasks SET curstate = $1 WHERE mytable_key = $2`, [newstate, taskid], (err, result) => {
    if (!err) {
      //TODO
      // добавить синхронизацию
      res.json({
        Taskname: newTaskName,
        CurState: newstate
      });
    }
  });
});

app.post('/project/changeState', (req, res) => {
  const taskid = req.body.taskID;
  const newstate = req.body.newState;
  // console.log(taskid, newstate);
  pool.query(`UPDATE alltasks SET curstate = $1 WHERE mytable_key = $2`, [newstate, taskid], (err, result) => {
    if (!err) {
      //TODO добавить синхронизацию
      res.json({
        taskID: taskid,
        CurState: newstate
      });
    }
  });
});

app.post('/project/deleteTask', (req, res) => {
  const taskid = req.body.taskID;
  pool.query('DELETE FROM alltasks WHERE mytable_key = $1', [taskid], (err, result) => {
    if (!err) {
      //TODO
      // добавить синхронизацию
    }
  });
});

// ----------------------------------------

server.listen(port, () => {
  console.log(`Backend link is = http://localhost:${port}`);
});