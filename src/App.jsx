import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { makeServer } from "./api/server";
import Navbar from "./components/Navbar";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Assessments from "./pages/Assessments";

makeServer();

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/assessments" element={<Assessments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
