# TalentFlow - Mini Hiring Platform

A full-featured recruitment management platform built with React, MirageJS, and Dexie. TalentFlow allows HR teams to manage jobs, candidates, and assessments with complete offline persistence and simulated backend functionality.

## 🚀 Live Demo

[Deployed App Link] - *(Add your deployment URL here)*

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [API Endpoints](#api-endpoints)
- [Design Decisions](#design-decisions)
- [Known Limitations](#known-limitations)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)

## ✨ Features

### Jobs Management
- Create, edit, and archive jobs with validation
- Server-like pagination and filtering (title, status, tags)
- Deep linking to individual jobs (`/jobs/:jobId`)
- Drag-and-drop reordering with optimistic updates and rollback
- Status management (active/archived)

### Candidates Dashboard
- Virtualized list handling 1000+ candidates efficiently
- Client-side search by name and email
- Kanban-style stage management with dropdown transitions
- Individual candidate profile pages with timeline
- Stage progression: Applied → Screen → Tech → Offer → Hired/Rejected

### Assessment Builder
- Job-specific assessment creation
- Multiple question types:
  - Short text input
  - Long text (textarea)
  - Number input with range validation
  - Single choice (radio buttons)
  - Multiple choice (checkboxes)
  - File upload (UI only)
- Live preview pane showing form as candidates would see it
- Validation rules (required fields, numeric ranges)
- Persistent storage of assessments per job

## 🛠 Tech Stack

- **Frontend**: React 19 with React Router DOM
- **State Management**: Zustand for global state
- **Styling**: Tailwind CSS 4.1 with custom CSS
- **Database**: Dexie.js (IndexedDB wrapper) for local persistence
- **API Simulation**: MirageJS with artificial latency and error simulation
- **Build Tool**: Vite
- **Data Generation**: Faker.js for seed data

## 🚦 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd talentflow

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📁 Project Structure

```
talentflow/
├── public/                 # Static assets
├── src/
│   ├── api/
│   │   └── server.js       # MirageJS server configuration
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation component
│   │   └── Navbar.css       # Navigation styles
│   ├── pages/
│   │   ├── Jobs.jsx         # Jobs listing and management
│   │   ├── Jobs.css         # Jobs page styles
│   │   ├── JobDetail.jsx    # Individual job details
│   │   ├── JobDetail.css    # JobDetail page styles
│   │   ├── Candidates.jsx   # Candidates dashboard
│   │   ├── Candidates.css   # Candidates page styles
│   │   ├── CandidateDetail.jsx # Individual candidate profile
│   │   ├── CandidateDetail.css # CandidateDetail page styles
│   │   ├── Assessments.jsx  # Assessment builder
│   │   └── Assessments.css  # Assessments page styles
│   ├── store/
│   │   └── useStore.js      # Zustand global state
│   ├── utils/
│   │   └── persist.js       # IndexedDB persistence helpers
│   ├── db.js                # Dexie database configuration
│   ├── App.jsx              # Main app component
│   └── index.jsx            # App entry point
├── package.json
└── README.md


```

## 🏗 Architecture

### Data Flow
1. **UI Components** interact with Zustand store for state management
2. **Store Functions** persist data via Dexie.js to IndexedDB
3. **MirageJS** simulates REST API endpoints with realistic latency and errors
4. **Persistence Layer** ensures data survives page refreshes

### State Management Strategy
- **Zustand** chosen over Redux for simplicity and minimal boilerplate
- Centralized state for jobs, candidates, and assessments
- Optimistic updates with rollback capabilities for failed operations

### Persistence Strategy
- **Dexie.js** for local IndexedDB storage
- Complete offline functionality
- Data restoration on page refresh
- Write-through caching pattern

## 🎯 Core Features

### Jobs Board
- **Pagination**: Server-like pagination with configurable page sizes
- **Filtering**: Search by title, filter by status (active/archived)
- **CRUD Operations**: Full create, read, update, delete functionality
- **Reordering**: Drag-and-drop with optimistic updates and error rollback
- **Validation**: Title required, unique slug generation

### Candidates Management
- **Scalable List**: Handles 1000+ candidates efficiently
- **Search & Filter**: Real-time search by name/email
- **Stage Management**: Visual kanban-style stage transitions
- **Profile Pages**: Individual candidate timelines and details
- **Stage Transitions**: Applied → Screen → Tech → Offer → Hired/Rejected

### Assessment System
- **Builder Interface**: Intuitive question builder with live preview
- **Question Types**: Text, textarea, number, radio, checkbox, file upload
- **Validation Rules**: Required fields, numeric ranges, conditional logic
- **Preview Mode**: Real-time form preview for testing
- **Persistence**: Automatic saving of assessment configurations

## 🔌 API Endpoints

### Jobs
```
GET    /api/jobs?search=&status=&page=&pageSize=
POST   /api/jobs
PATCH  /api/jobs/:id
PATCH  /api/jobs/reorder
```

### Candidates
```
GET    /api/candidates
POST   /api/candidates
PATCH  /api/candidates/:id
```

### Assessments
```
GET    /api/assessments/:jobId
PUT    /api/assessments/:jobId
POST   /api/assessments/:jobId/submit
```

## 🧠 Design Decisions

### 1. State Management - Zustand
**Why**: Simpler than Redux with less boilerplate while maintaining predictable state updates and good TypeScript support.

### 2. Local Persistence - Dexie.js
**Why**: IndexedDB provides robust client-side storage with better performance than localStorage for large datasets. Dexie.js offers a clean Promise-based API.

### 3. API Simulation - MirageJS
**Why**: Enables realistic backend simulation with latency, error handling, and data manipulation without requiring a real server.

### 4. Candidate Stage Management - Dropdown
**Why**: Simplified implementation for MVP. Drag-and-drop kanban boards planned for future iterations.

### 5. Assessment Builder - Progressive Enhancement
**Why**: Started with basic question types, designed for easy extension to support complex conditional logic and validation rules.

### 6. Component Architecture - Page/Component Split
**Why**: Clear separation between page-level components (routing) and reusable UI components for maintainability.

## ⚠️ Known Limitations

### Current Implementation Gaps
- **Jobs**: Missing edit functionality, limited deep-linking
- **Candidates**: No drag-and-drop kanban, limited search filters
- **Assessments**: Limited question types, no conditional logic implementation
- **General**: No real-time updates, no user authentication

### Performance Considerations
- Large candidate lists may need virtualization improvements
- Assessment builder could benefit from debounced auto-save
- Pagination could be optimized with better caching

### UI/UX Areas for Improvement
- Mobile responsiveness needs enhancement
- Loading states could be more sophisticated
- Error handling messages need improvement
- Accessibility features need implementation

## 🛣 Future Roadmap

### Phase 1 - Core Improvements
- [ ] Complete drag-and-drop kanban for candidates
- [ ] Enhanced search and filtering across all modules
- [ ] Mobile-responsive design improvements
- [ ] Comprehensive error handling and user feedback

### Phase 2 - Advanced Features
- [ ] Real backend integration (Node.js + MongoDB)
- [ ] User authentication and role-based access
- [ ] Advanced assessment features (conditional logic, file uploads)
- [ ] Email notifications and communication features

### Phase 3 - Enterprise Features
- [ ] Analytics dashboard with hiring metrics
- [ ] Integration with external job boards
- [ ] Advanced reporting and export capabilities
- [ ] Multi-tenant architecture for different organizations

### Technical Debt
- [ ] Comprehensive test suite (unit, integration, e2e)
- [ ] TypeScript migration for better type safety
- [ ] Performance optimization and code splitting
- [ ] Accessibility compliance (WCAG 2.1)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


### Accessibility & Responsiveness
- Fully responsive layouts for desktop and mobile devices
- Dark mode toggle for better visual ergonomics

### Development Guidelines
- Follow existing code style and conventions
- Add appropriate comments for complex logic
- Update documentation for new features
- Test functionality across different browsers
- Ensure mobile compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the robust frontend framework
- **Zustand** for elegant state management
- **Dexie.js** for powerful IndexedDB abstraction
- **MirageJS** for excellent API mocking capabilities
- **Faker.js** for generating realistic test data
