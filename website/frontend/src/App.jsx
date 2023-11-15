import React from 'react';
import './App.css';
import io from 'socket.io-client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TransferListComponent from './components/TransferListComponent';
// import TextFieldComponent from './components/TextFieldComponent';
import AuthorizationComponent from './components/AuthorizationComponent';

const host = 'http://localhost:5000'
const socket = io(host);

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthorizationComponent />} />
          {/* <Route path="/authorization" element={<h1>HI</h1>}>
        </Route> */}
          <Route path="/taskboard" element={<TransferListComponent socket={socket} host={host} />}>
          </Route>
        </Routes>
      </BrowserRouter >
    </div>
  );

}

export default App;