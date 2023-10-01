const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

// Конфигурация базы данных
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

client.connect() // Само подключение к БД
  .then(() => {
    console.log('Connected to PostgreSQL db');
  })


app.set('view engine', 'ejs'); // Установка каркаса EJS

app.listen(port, () => { // Вывод в конлсоль URL
  const server_URL = `http://localhost:${port}`;
  console.log(`Server is running on ${server_URL}`);
});

app.get('/', (req, res) => { // Начальная страница
    res.render('index');
  });
  app.get('/change_data', (req, res) => { //Страница изменения данных
    client.query('SELECT * FROM users_base', (err, result) => {
        res.render('data', { users: result.rows });
    });
  });

  app.get('/increment', (req, res) => { // Увеличение
    client.query('UPDATE users_base SET id = id + 1 WHERE id = (SELECT id FROM users_base)', (err, result) => {
        res.redirect('/change_data');
    });
  });

  app.get('/decrement', (req, res) => { // Уменьшение
    client.query('UPDATE users_base SET id = id - 1 WHERE id = (SELECT id FROM users_base)', (err, result) => {
        res.redirect('/change_data');
    });
  });