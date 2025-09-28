import { create } from "zustand";

export const useStore = create((set) => ({
  jobs: [],
  candidates: [],
  assessments: [],
  setJobs: (jobs) => set({ jobs }),
  setCandidates: (candidates) => set({ candidates }),
  setAssessments: (assessments) => set({ assessments }),
  
  
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, updates) => set((state) => ({
    jobs: state.jobs.map(job => job.id === id ? { ...job, ...updates } : job)
  })),
  updateCandidate: (id, updates) => set((state) => ({
    candidates: state.candidates.map(candidate => 
      candidate.id === id ? { ...candidate, ...updates } : candidate
    )
  }))
}));
