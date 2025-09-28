TalentFlow

TalentFlow is a full-featured recruitment management platform built with React, MirageJS, and Dexie. It allows you to manage jobs, candidates, and assessments with persistence, simulated APIs, and an extendable architecture for scaling to real-world scenarios.

Table of Contents

Setup

Architecture

Features

Decisions & Design Choices

Known Limitations / Roadmap

Setup
Prerequisites

Node.js v18+

npm or yarn

Install Dependencies
git clone <repository-url>
cd talentflow
npm install

Run Application
npm start


The app runs at http://localhost:3000.

Project Structure
talentflow/
│── public/
│── src/
│   ├── api/
│   │   └── server.js            # MirageJS server simulating API endpoints
│   ├── components/
│   │   └── Navbar.jsx           # Navigation bar
│   ├── db.js                    # Dexie.js database setup
│   ├── utils/
│   │   └── persist.js           # Helper functions for persistence
│   ├── store/
│   │   └── useStore.js          # Zustand store for global state
│   ├── pages/
│   │   ├── Jobs.jsx
│   │   ├── Jobs.css
│   │   ├── JobDetail.css
│   │   ├── Candidates.jsx
│   │   ├── Candidates.css
│   │   ├── Assessments.jsx
│   │   └── Assessments.css
│   ├── App.jsx
│   └── index.jsx
│── package.json

Architecture
Core Stack

React for UI

Zustand for state management

Dexie.js for local IndexedDB persistence

MirageJS for API simulation with artificial latency & error handling

Data Flow

UI Components interact with Zustand store.

Store functions persist data via Dexie.

MirageJS simulates backend CRUD, allowing you to test latency, errors, and API logic.

Pages & Features
Jobs

Create, archive/unarchive, and reorder jobs.

Rollback on failure during reorder.

Persisted via Dexie.

Candidates

Stage transitions (dropdown)

Persisted via Dexie

Seeded with 1000 candidates

Assessments

Builder + Preview per job

Save & persist per job

Supports text/textarea/number inputs (other types pending)

Decisions & Design Choices
1. State Management

Chose Zustand over Redux for simplicity and minimal boilerplate.

Store centralized data for jobs, candidates, and assessments.

2. Persistence

Dexie.js chosen for local persistence; allows offline simulation and persistence across reloads.

3. Backend Simulation

MirageJS used to mock REST API endpoints for development/testing.

Artificial latency and error simulation enable testing of rollback and loading states.

4. Candidate Management

Stage transitions implemented via dropdown for simplicity.

Drag-and-drop and virtualized list left for future scalability improvements.

5. Assessment Builder

Sections, question types, conditional logic, and validations are planned.

Currently supports text-based questions and basic number input.

Known Limitations / Roadmap
Module	Pending Features
Jobs	Pagination, filtering, edit job, deep-link /jobs/:jobId
Candidates	Virtualized list, search/filter, profile route with timeline, kanban drag-and-drop, notes with mentions
Assessments	Full question types (single/multi-choice, numeric range, file upload), sections, validation rules, conditional questions, candidate submission route
Future Improvements

Integrate real backend (Node.js/Express + MongoDB).

Add candidate profile pages with timeline and notes.

Enhance assessments with all required question types and submission endpoints.

Optimize large candidate list rendering using virtualization.

Quick Start Summary

Clone repo → npm install

Run → npm start

Browse Jobs, Candidates, and Assessments

Data persisted locally via IndexedDB
