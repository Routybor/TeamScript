import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProjectsPage from './ProjectsPage';
import PrimaryPage from './PrimaryPage';

const StartPage = (token) => {
    if (token) {
        return (
            <Route path="/" element={<ProjectsPage />}>
            </Route>
        );
    }
    else {
        return (
            <Route path="/" element={<PrimaryPage />}>
            </Route>
        );
    }
}

export default StartPage;