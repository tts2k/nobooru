import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartPage from "./pages/StartPage";
import BrowsePage from "./pages/BrowsePage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="wrapper">
      <Navbar />
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
