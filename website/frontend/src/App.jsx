import React, { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TransferListComponent from './components/TransferListComponent';
// import TextFieldComponent from './components/TextFieldComponent';
import AuthorizationComponent from './components/AuthorizationComponent';
import useToken from './helper/useToken';

const host = 'http://localhost:5000'
const socket = io(host);


function App() {
  const { token, setToken } = useToken();
  if (!token) {
    return <AuthorizationComponent setToken={setToken} />
  }
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<AuthorizationComponent setToken={setToken} />} /> */}
          {/* <Route path="/authorization" element={<h1>HI</h1>}>
        </Route> */}
          <Route path="/" element={<TransferListComponent socket={socket} host={host} />}>
          </Route>
        </Routes>
      </BrowserRouter >
    </div>
  );

}

export default App;