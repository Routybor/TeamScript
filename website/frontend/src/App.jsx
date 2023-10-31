import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import TransferList from './components/TransferList';
import TextFieldComponent from './components/TextFieldComponent';

const host = 'http://localhost:5000'
const socket = io(host);

function App() {
  const [textFieldValue, setTextFieldValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    receiveData();
    socket.on('updateText', (data) => {
      setTextFieldValue(data.text_column);
      setIsLoading(false);
    });
    return () => {
      socket.off('updateText');
    };
  }, []);

  const receiveData = () => {
    setIsLoading(true);
    fetch(`${host}/database`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      setTextFieldValue(data.text_column);
      setIsLoading(false);
      console.log('Data received =', data);
    })
    .catch((error) => {
      console.error('ERROR receiving data = ', error);
    });
  };

  const updateData = (event) => {
    if (!isLoading) {
      const newText = event.target.value;
      setIsLoading(true);
      fetch(`${host}/database/saveText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textField: newText }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          console.log('Text saved = ', data);
        })
        .catch((error) => {
          console.error('ERROR saving text = ', error);
        });
    }
  };

  return (
    <div className="App">
      <TextFieldComponent value={textFieldValue} updateData={updateData} />
      <h1> Задачи </h1>
      <TransferList />
    </div>
  );

  }
export default App;