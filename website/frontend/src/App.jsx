import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthorizationPage from "./pages/AuthorizationPage";
import TaskBoardPage from './pages/TaskBoardPage';
import useToken from './helper/useToken';
import ProjectsPage from './pages/ProjectsPage';
import PrimaryPage from './pages/PrimaryPage';
import RegistrationPage from './pages/RegistrationPage';

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return (
      <div className='App'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrimaryPage />}>
            </Route>
            <Route path="/authorization" element={<AuthorizationPage setToken={setToken} />}>
            </Route>
            <Route path="/registration" element={<RegistrationPage />}>
            </Route>
          </Routes>
        </BrowserRouter>
      </div >
    );
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
      </BrowserRouter>
    </div >
  );


}

export default App;