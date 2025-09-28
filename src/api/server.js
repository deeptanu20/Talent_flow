import { createServer, Model, Factory, Response } from "miragejs";
import { faker } from "@faker-js/faker"; // Updated import
import {
  saveJobs, loadJobs,
  saveCandidates, loadCandidates,
  saveAssessment, loadAssessment
} from "../utils/persist";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,
    models: {
      job: Model,
      candidate: Model,
      assessment: Model,
    },
    factories: {
      job: Factory.extend({
        title() { return faker.person.jobTitle(); }, // Updated faker API
        slug(i) { return `job-${i}`; },
        status() { return faker.helpers.arrayElement(["active", "archived"]); }, // Updated method
        tags() { return [faker.hacker.ingverb(), faker.hacker.noun()]; },
        order(i) { return i; }
      }),
      candidate: Factory.extend({
        name() { return faker.person.fullName(); }, // Updated faker API
        email() { return faker.internet.email(); },
        stage() { return faker.helpers.arrayElement(["applied","screen","tech","offer","hired","rejected"]); } // Updated method
      }),
    },
    seeds(server) {
      loadJobs().then(async (storedJobs) => {
        if (storedJobs.length === 0) {
          const jobs = server.createList("job", 25).models.map(m => m.attrs);
          await saveJobs(jobs);
        }
      });

      loadCandidates().then(async (stored) => {
        if (stored.length === 0) {
          const candidates = server.createList("candidate", 1000).models.map(m => m.attrs);
          await saveCandidates(candidates);
        }
      });
    },
    routes() {
      this.namespace = "api";
      this.timing = 400;

      
      function maybeError() {
        if (Math.random() < 0.1) {
          return new Response(500, {}, { error: "Random failure" });
        }
        return null;
      }

      // Jobs(updated)
  this.get("/jobs", async (schema, req) => {
  let { search, status, page = 1, pageSize = 5 } = req.queryParams;
  page = Number(page);
  pageSize = Number(pageSize);

  let jobs = await loadJobs();

  if (search) {
    jobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (status) {
    jobs = jobs.filter(j => j.status === status);
  }

  const total = jobs.length;
  const start = (page - 1) * pageSize;
  const paginated = jobs.slice(start, start + pageSize);

  return { jobs: paginated, total };
});


      this.post("/jobs", async (_, req) => {
        const errorResponse = maybeError();
        if (errorResponse) return errorResponse;
        
        let job = JSON.parse(req.requestBody);
        let jobs = await loadJobs();
        job.id = jobs.length ? Math.max(...jobs.map(j => j.id)) + 1 : 1;
        jobs.push(job);
        await saveJobs(jobs);
        return { job };
      });

      this.patch("/jobs/:id", async (_, req) => {
        const errorResponse = maybeError();
        if (errorResponse) return errorResponse;
        
        let id = Number(req.params.id);
        let attrs = JSON.parse(req.requestBody);
        let jobs = await loadJobs();
        let updated = jobs.map(j => j.id === id ? { ...j, ...attrs } : j);
        await saveJobs(updated);
        return { job: updated.find(j => j.id === id) };
      });

      // Fixed reorder endpoint - should use job ID, not order
      this.patch("/jobs/reorder", async (_, req) => {
        const errorResponse = maybeError();
        if (errorResponse) return errorResponse;
        
        let { fromOrder, toOrder } = JSON.parse(req.requestBody);
        let jobs = await loadJobs();

        const moved = jobs.find(j => j.order === fromOrder);
        if (!moved) return new Response(400, {}, { error: "Invalid order" });

        jobs.forEach(j => {
          if (fromOrder < toOrder) {
            if (j.order > fromOrder && j.order <= toOrder) j.order -= 1;
          } else {
            if (j.order < fromOrder && j.order >= toOrder) j.order += 1;
          }
        });
        moved.order = toOrder;

        await saveJobs(jobs);
        return { jobs };
      });

      // Candidates
      this.get("/candidates", async () => {
        return { candidates: await loadCandidates() };
      });

      this.post("/candidates", async (_, req) => {
        const errorResponse = maybeError();
        if (errorResponse) return errorResponse;
        
        let candidate = JSON.parse(req.requestBody);
        let list = await loadCandidates();
        candidate.id = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
        list.push(candidate);
        await saveCandidates(list);
        return { candidate };
      });

      this.patch("/candidates/:id", async (_, req) => {
        const errorResponse = maybeError();
        if (errorResponse) return errorResponse;
        
        let id = Number(req.params.id);
        let attrs = JSON.parse(req.requestBody);
        let list = await loadCandidates();
        let updated = list.map(c => c.id === id ? { ...c, ...attrs } : c);
        await saveCandidates(updated);
        return { candidate: updated.find(c => c.id === id) };
      });

      // Assessments
      this.get("/assessments/:jobId", async (_, req) => {
        const assessment = await loadAssessment(req.params.jobId);
        return { assessment };
      });

      this.put("/assessments/:jobId", async (_, req) => {
        const errorResponse = maybeError();
        if (errorResponse) return errorResponse;
        
        let jobId = req.params.jobId;
        let data = JSON.parse(req.requestBody);
        await saveAssessment(jobId, { questions: data.questions });
        return { assessment: { id: jobId, questions: data.questions } };
      });
    }
  });
}