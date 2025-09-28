import { db } from "../db";

// Jobs
export async function saveJobs(jobs) {
  await db.jobs.clear();
  await db.jobs.bulkAdd(jobs);
}
export async function loadJobs() {
  return await db.jobs.toArray();
}

// Candidates
export async function saveCandidates(candidates) {
  await db.candidates.clear();
  await db.candidates.bulkAdd(candidates);
}
export async function loadCandidates() {
  return await db.candidates.toArray();
}

// Assessments
export async function saveAssessment(jobId, assessment) {
  await db.assessments.put({ id: jobId, ...assessment });
}
export async function loadAssessment(jobId) {
  return await db.assessments.get(jobId);
}
