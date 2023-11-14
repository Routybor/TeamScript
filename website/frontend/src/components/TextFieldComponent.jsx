import React, { useState, useEffect } from 'react';
import { TextField } from "@mui/material";

function TextFieldComponent(props) {
  const [textFieldValue, setTextFieldValue] = useState('');
  const [pendingData, setPendingData] = useState('');
  const [sendDataEnabled, setSendDataEnabled] = useState(false);

  useEffect(() => {
    receiveData();
    props.socket.on('updateText', (data) => {
      if (data.text_column) {
        setTextFieldValue(data.text_column);
      }
    });
    return () => {
      props.socket.off('updateText');
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
    fetch(`${props.host}/database`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTextFieldValue(data.text_column);
        console.log('Data received =', data);
      })
      .catch((error) => {
        console.error('ERROR receiving data = ', error);
      });
  };

  const sendUpdatedData = (newText) => {
    fetch(`${props.host}/database/saveText`, {
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
    <TextField
      fullWidth
      value={textFieldValue}
      id="standard-basic"
      label="Enter your text here"
      multiline
      onChange={handleInputChange}
    />
  );
}

export default TextFieldComponent;