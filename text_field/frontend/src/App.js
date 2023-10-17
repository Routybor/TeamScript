import React, { useState } from 'react';
import { TextField } from "@mui/material";
import './App.css';


function App() {
  const [name, setName] = useState("");
  const [id, setID] = useState(0);
  // const [isLoading, setIsLoading] = useState(true);

  const setText = () => {
    fetch('/database/saveText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentID: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setID(data.id);
      })
      .catch((error) => console.error('ERROR = ', error));
  };


  return (
    <div className="App">
      <div className="main-content">
      </div>
      <TextField 
        fullWidth 
        value={name} 
        id="standard-basic" 
        label="Enter your text here" 
        multiline
        onChange={(e) => {
          setName(e.target.value);
          setText();
        }}/>
    </div>
  );
}

export default App;
