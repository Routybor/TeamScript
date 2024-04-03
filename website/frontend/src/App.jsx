import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthorizationPage from "./pages/AuthorizationPage";
import TaskBoardPage from './pages/TaskBoardPage';
import useToken from './helper/useToken';
import ProjectsPage from './pages/ProjectsPage';
import PrimaryPage from './pages/PrimaryPage';
import RegistrationPage from './pages/RegistrationPage';
import StartPage from './pages/StartPage';

function App() {
  const { token, setToken } = useToken();

  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={token ? <ProjectsPage /> : <PrimaryPage />} />
        {/* <Route path="/primarypage" element={<PrimaryPage />} /> */}
        <Route path="/authorization" element={<AuthorizationPage setToken={setToken} />}>
        </Route>
        <Route path="/registration" element={<RegistrationPage setToken={setToken} />}>
        </Route>
        <Route path="/taskboard" element={<TaskBoardPage />}>
        </Route>
        {/* <Route path="/projects" element={<ProjectsPage />}> */}
        {/* </Route> */}
      </Routes>
    </div >
  );


}

export default App;