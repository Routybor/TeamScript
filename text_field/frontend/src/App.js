import React, { useState } from 'react';
import { TextField } from "@mui/material";
import './App.css';


function App() {
  const [textFieldValue, setTextFieldValue] = useState('');
  const handleTextFieldChange = (event) => {
    const newText = event.target.value;
    fetch('/database/saveText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textField: newText }),
    })
      .then((response) => { return response.json(); })
      .then((data) => {
        setTextFieldValue(data.text_column);
        console.log('Text saved successfully = ', data);
      })
      .catch((error) => {
        console.error('Error saving text = ', error);
      });
      setTextFieldValue(newText);
  };


  return (
    <div className="App">
      <div className="main-content">
      </div>
      <TextField
        fullWidth
        value={textFieldValue}
        id="standard-basic"
        label="Enter your text here"
        multiline
        onChange={handleTextFieldChange}/>
    </div>
  );
}

export default App;
