import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TransferListComponent from './components/TransferListComponent';
import TextFieldComponent from './components/TextFieldComponent';
import AuthorizationComponent from './components/AuthorizationComponent';
import useToken from './helper/useToken';

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
                    <Route path="/" element={<TransferListComponent />}>
                    </Route>
                </Routes>
            </BrowserRouter >
        </div>
    );

}

export default App;