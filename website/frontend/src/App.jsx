import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import TransferList from './components/TransferList';
import TextFieldComponent from './components/TextFieldComponent';

const host = 'http://localhost:5000'
const socket = io(host);

function App() {
  return (
    <div className="App">
      <TextFieldComponent socket={socket} host={host}/>
      <h1> Задачи </h1>
      <TransferList socket={socket} host={host}/>
    </div>
  );

}

export default App;