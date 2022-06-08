import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Preferences from "./components/Preferences/Preferences";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from './components/Login/Login';

function App() {
    const [token, setToken] = useState();

    if (!token) {
        return <Login setToken={setToken} />
    }
    return (
        <div className="wrapper">
            <h1>Application</h1>
            <BrowserRouter>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/prefererences" element={<Preferences/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
