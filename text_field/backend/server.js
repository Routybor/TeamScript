// Ниже перечисляются требуемые модули, если npm ругается на ошибку импорта, сокорее всего это пофиксится 'npm i ' + модуль из этого списка
const express = require('express') // Фреймворк для js, упрощает работу с HTTP запросами, маршрутизацией и бла бла бла
const { Client } = require('pg'); // Постгрес, база данных
const bodyParser = require('body-parser'); // Парсер для запросов с фронтенда (они в формате джсона у нас)
const socketIo = require('socket.io'); // Для управления сокетами пользователей из сервера. По сути двусторонняя связь между браузером(клиентом) и сервером(теперь запросы отправлять можно и из сервера)
const http = require('http'); // Модуль для создания HTTP серверов, это всё для связи сервера и клиента (верхний модуль)

const app = express() // Создание Express приложения, с которым и бкдем работать
const port = 5000; // Обозначаем порт СЕРВЕРА
const server = http.createServer(app);
const io = socketIo(server);

const client = new Client({ // Это база
  user: 'teamscriptproj',
  host: 'ep-rapid-morning-14341499.eu-central-1.aws.neon.tech',
  database: 'Text_input',
  password: 'Sv6q0diQZxfP',
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Можно навести на первое слово и там написано
  },
});

client.connect() // Подключаем БД
  .then(() => {
    console.log('Connected to PostgreSQL db'); // И логируем что всё успешно
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL db = ', error); // Или не очень
  });

app.get('/database', (req, res) => { // GET запрос для получения данных из базы
  client.query('select text_column from text_table', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    } else {
      res.json(result.rows[0]); // [0] -> первая строка
    }
  });
});

app.use(bodyParser.json()); // Подключаем парсер для обработки POST запросов

const sendUpdateToClients = (newText) => { // Функция для отправки в фронтенд
  io.emit('updateText', { text_column: newText }); //Отправляем сообщение updateText со значением newText с помощью io
};

app.post('/database/saveText', (req, res) => { // Запись в базу данных
  const newText = req.body.textField;
  client.query(`UPDATE text_table
                SET text_column = '${newText}'
                WHERE id = 1 `, (err, result) => {
    if (!err) {
      sendUpdateToClients(newText); // После того, как записали изменения одного клиента, отправляем сообщение на фронт всем клиентам
      res.json({ text_column: newText });
    }
  });
});

server.listen(port, () => { // Запуск сервера, вывод в консоль информации для удобства.
  console.log(`Server is running on port = ${port}`); // +- Бесполезная инфа
  console.log(`Backend link is = http://localhost:${port}`); // К этой ссылке можно приписать URL и если этот URL используется для GET запроса, это даже будет работать
});