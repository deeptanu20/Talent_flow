import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-100 flex gap-4">
      <NavLink to="/jobs" className="hover:underline">Jobs</NavLink>
      <NavLink to="/candidates" className="hover:underline">Candidates</NavLink>
      <NavLink to="/assessments" className="hover:underline">Assessments</NavLink>
    </nav>
  );
}
