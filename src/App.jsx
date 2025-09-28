import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { makeServer } from "./api/server";
import Navbar from "./components/Navbar";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Candidates from "./pages/Candidates";
import Assessments from "./pages/Assessments";
import CandidateDetail from "./pages/CandidateDetail"; 

makeServer();

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<Jobs />} />
         <Route path="/jobs/:jobId" element={<JobDetail />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/:id" element={<CandidateDetail />} />
        <Route path="/assessments" element={<Assessments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
