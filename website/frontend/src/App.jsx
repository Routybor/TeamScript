import React, { useState, useEffect } from 'react';
import { TextField } from "@mui/material";
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // С помощью io создаём сокет, когда указываем / метод сам ищет бек, с которого запущен сайт

function App() {
  const [textFieldValue, setTextFieldValue] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Для обработки загрузок по дефолту загрузка True

  useEffect(() => { // С помощью этого при первой отрисовки сайта данные с  базы данных сразу появляются на странице
    receiveData(); // Собственно получение данных с БД
    socket.on('updateText', (data) => { // Начинаем проверять(слушать) сокет на наличие данного сообщения и если оно получено, data из сообщения отправляется далее
      setTextFieldValue(data.text_column); // Заночим данные в поле
      setIsLoading(false); // Завершаем получение и объявляем о окончании загрузки
    });
    return () => {
      socket.off('updateText'); // Если страница закрыта во избежание утечек памяти и ненужных процессов завершаем проверять сокет
    };
  }, []); // Так как список зависимостей [] пустой => выполнится при загрузке

  const receiveData = () => { // Отправка на бек HTTP запроса и получение ответа(данных с БД)
    setIsLoading(true); // Пока выполняем объявляем загрузку
    fetch('http://localhost:5000/database', { // URL
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json()) // Форматируем ответ в джсон
    .then((data) => {
      setTextFieldValue(data.text_column); // Данные в текстовое поле берем из бека
      setIsLoading(false);
      console.log('Data received =', data); // Посмотреть = Inspect element -> Console
    })
    .catch((error) => {
      console.error('ERROR receiving data = ', error); // Посмотреть = Inspect element -> Console
    });
  };

  const updateData = (event) => { // Отправка на бек HTTP запроса и данных для БД и получение ответа(вставленных в БД данных)
    if (!isLoading) {
      const newText = event.target.value;
      setIsLoading(true);
      fetch('http://localhost:5000/database/saveText', { // URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textField: newText }),
      })
        .then((response) => response.json())
        .then((data) => {
          // setTextFieldValue(data.text_column);  // Вообще это уже делает сокет
          setIsLoading(false);
          console.log('Text saved = ', data); // Посмотреть = Inspect element -> Console
        })
        .catch((error) => {
          console.error('ERROR saving text = ', error); // Посмотреть = Inspect element -> Console
        });
    }
  };

  return (
    <div className="App">
      <TextField
        fullWidth
        value={textFieldValue}
        id="standard-basic"
        label="Enter your text here"
        multiline
        onChange={updateData}
      />
    </div>
  );
}

export default App;
