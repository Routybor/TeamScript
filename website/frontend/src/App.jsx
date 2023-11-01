import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import TransferList from './components/TransferList';
import TextFieldComponent from './components/TextFieldComponent';

const host = 'http://localhost:5000'
const socket = io(host);

function App() {
  const [textFieldValue, setTextFieldValue] = useState('');
  const [pendingData, setPendingData] = useState('');
  const [sendDataEnabled, setSendDataEnabled] = useState(false);

  useEffect(() => {
    receiveData();
    socket.on('updateText', (data) => {
      if (data.text_column) {
        setTextFieldValue(data.text_column);
      }
    });
    return () => {
      socket.off('updateText');
    };
  }, []);

  useEffect(() => {
    const sendPendingData = () => {
      if (sendDataEnabled) {
        sendUpdatedData(pendingData);
      }
    };
    const sendToBackendTimer = setTimeout(sendPendingData, 200);
    return () => {
      clearTimeout(sendToBackendTimer);
    };
  }, [pendingData, sendDataEnabled]);

  const receiveData = () => {
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
    fetch(`${host}/database/saveText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textField: newText }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Text saved = ', data);
      })
      .catch((error) => {
        console.error('ERROR saving text = ', error);
      });
  };

  const handleInputChange = (event) => {
    setTextFieldValue(event.target.value);
    setPendingData(event.target.value);
    setSendDataEnabled(true);
  };

  return (
    <div className="App">
      <TextFieldComponent value={textFieldValue} handleInputChange={handleInputChange} />
      <h1> Задачи </h1>
      <TransferList />
    </div>
  );

}

export default App;