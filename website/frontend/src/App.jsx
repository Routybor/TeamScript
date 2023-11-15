import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import TransferList from './components/TransferList';
import TextFieldComponent from './components/TextFieldComponent';

const host = 'http://localhost:5000'
const socket = io(host);

function App() {
  const [token, setToken] = useState();
  if (!token) {
    return <AuthorizationComponent setToken={setToken} />
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>HI</h1>} />
        {/* <Route path="/authorization" element={<h1>HI</h1>}>
        </Route> */}
        <Route path="/taskboard" element={<TransferListComponent socket={socket} host={host} />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );

}

export default App;