import React, { useState, useEffect } from 'react';
import { TextField } from "@mui/material";
import './App.css';
import io from 'socket.io-client';

const host = 'http://localhost:5000';
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

  const sendUpdatedData = (newText) => {
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
  };

  const handleInputChange = (event) => {
    setTextFieldValue(event.target.value);
    setTimeout(() => {
      sendUpdatedData(event.target.value);
    }, 100);
  };

  return (
    <div className="App">
      <TextField
        fullWidth
        value={textFieldValue}
        id="standard-basic"
        label="Enter your text here"
        multiline
        onChange={handleInputChange}
      />
    </div>
  );
}

export default App;
