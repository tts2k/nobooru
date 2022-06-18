import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartPage from "./pages/StartPage";
import BrowsePage from "./pages/BrowsePage";

function setToken(token) {
  sessionStorage.setItem("token", token);
}

function getToken() {
  return sessionStorage.getItem("token");
}

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/browse" element={<BrowsePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
