const express = require('express') // Для создания сервера будем использовать express
const app = express()
const { Client } = require('pg'); // для работы с PostgreSQL db используем pg
const port = 5000; 
const bodyParser = require('body-parser');  // Для получения данных форм из запроса 
                                            //необходимо использовать специальный пакет body-parser. 

let id = 0
const client = new Client({
    user: 'teamscriptproj',
    host: 'ep-rapid-morning-14341499.eu-central-1.aws.neon.tech',
    database: 'TEST',
    password: 'Sv6q0diQZxfP',
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL db');
  })


app.listen(port, () => {
  console.log(`Server is running on port = ${port}`);
});


app.get('/database', (req, res) => {
    client.query('SELECT * FROM users_base', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error while getting data from database' });
        } else {
            const id = result.rows.map(row => row.id);
            res.json({ id });
        }
    });
});

app.use(bodyParser.json());
app.post('/database/increment', (req, res) => {
    const currentID = req.body.currentID;
    const newID = currentID + 1;
    client.query('UPDATE users_base SET id = id + 1 WHERE id = (SELECT id FROM users_base)', (err, result) => {
      res.json({ id: newID });
    });
  });

  app.post('/database/decrement', (req, res) => {
    const currentID = req.body.currentID;
    const newID = currentID - 1;
    client.query('UPDATE users_base SET id = id - 1 WHERE id = (SELECT id FROM users_base)', (err, result) => {
      res.json({ id: newID });
    });
  });
