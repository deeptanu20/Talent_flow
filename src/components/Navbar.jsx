import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar-container">
      <div className="navbar-logo">TalentFlow</div>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Jobs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/candidates"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Candidates
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/assessments"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Assessments
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
