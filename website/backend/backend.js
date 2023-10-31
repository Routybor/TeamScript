const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const port = 5000;
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
dotenv.config({ path: "../../.env" });
const pgUser = process.env.PGUSER;
const pgPassword = process.env.PGPASSWORD;
const pgHost = process.env.PGHOST;
const pgPort = process.env.PGPORT;
const pgDatabase = process.env.PGDATABASE;
const pgSsl = process.env.PGSSL === "true";
const pool = new Pool({
  user: pgUser,
  password: pgPassword,
  host: pgHost,
  port: pgPort,
  database: pgDatabase,
  ssl: pgSsl,
});

app.use(cors());

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

app.use(bodyParser.json());

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
  const newTaskName = req.body.taskname;
  const newstate = req.body.newState;
  console.log(newTaskName, newstate);
  pool.query(`insert into alltasks(taskname,curstate)
                values('${newTaskName}','${newstate}'); `, (err, result) => {
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

// ----------------------------------------

server.listen(port, () => {
  console.log(`Backend link is = http://localhost:${port}`);
});