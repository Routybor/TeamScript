import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Button } from '@mui/material';
import TransferListComponent from './components/TransferListComponent';
import TextFieldComponent from './components/TextFieldComponent';
import AuthorizationComponent from './components/AuthorizationComponent';
import AuthorizationPage from "./pages/AuthorizationPage";
import TaskBoardPage from './pages/TaskBoardPage';
import useToken from './helper/useToken';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  const { token, setToken } = useToken();
  // const { token, setToken } = useState();

  if (!token) {

    return (
      <div>
        <AuthorizationPage setToken={setToken} />
      </div>)
  }
  return (

    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProjectsPage />}>
          </Route>
          <Route path="/taskboard" element={<TaskBoardPage />}>
          </Route>
        </Routes>
      </BrowserRouter >
    </div>
  );

}

export default App;