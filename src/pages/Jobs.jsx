import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";

export default function Jobs() {
  const { jobs, setJobs } = useStore();
  const [loading, setLoading] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", slug: "" });

  useEffect(() => {
    setLoading(true);
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs))
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        alert("Error loading jobs");
      })
      .finally(() => setLoading(false));
  }, [setJobs]);

  const handleCreate = async () => {
    if (!newJob.title.trim()) return alert("Title is required");
    
    const slug = newJob.title.toLowerCase().replace(/\s+/g, "-");
    const job = { 
      ...newJob, 
      slug, 
      status: "active", 
      tags: [], 
      order: jobs.length 
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      });
      
      if (!res.ok) throw new Error("Failed to create job");
      
      const data = await res.json();
      setJobs([...jobs, data.job]);
      setNewJob({ title: "", slug: "" });
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Error creating job");
    }
  };

  const toggleArchive = async (id, status) => {
    const newStatus = status === "active" ? "archived" : "active";
    
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error("Failed to update job");
      
      const data = await res.json();
      setJobs(jobs.map((j) => (j.id === id ? data.job : j)));
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Error updating job");
    }
  };

  const reorder = async (from, to) => {
    // Prevent invalid moves
    if (to < 0 || to >= jobs.length || from === to) return;
    
    const prevJobs = [...jobs];
    
    // Optimistic update
    let reordered = jobs.map(j => ({ ...j }));
    reordered.forEach(j => {
      if (j.order === from) j.order = to;
      else if (from < to && j.order > from && j.order <= to) j.order -= 1;
      else if (from > to && j.order < from && j.order >= to) j.order += 1;
    });
    
    setJobs(reordered);

    try {
      const res = await fetch("/api/jobs/reorder", { // Fixed endpoint
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fromOrder: from, toOrder: to })
      });
      
      if (!res.ok) throw new Error("Reorder failed");
    } catch (error) {
      console.error("Error reordering jobs:", error);
      setJobs(prevJobs); // rollback
      alert("Reorder failed, rolled back");
    }
  };

  if (loading) return <div className="p-4">Loading jobs...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Jobs Board</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Job title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          className="border p-2 mr-2 rounded"
          onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button 
          onClick={handleCreate} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found. Add your first job above!</p>
      ) : (
        <ul className="space-y-2">
          {jobs
            .sort((a, b) => a.order - b.order)
            .map((job) => (
              <li key={job.id} className="flex justify-between items-center border p-3 rounded shadow-sm">
                <div className="flex flex-col">
                  <span className="font-medium">{job.title}</span>
                  <span className="text-sm text-gray-600">
                    Status: {job.status} | Order: {job.order}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleArchive(job.id, job.status)}
                    className={`text-sm px-3 py-1 rounded ${
                      job.status === "active" 
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {job.status === "active" ? "Archive" : "Unarchive"}
                  </button>
                  <button
                    onClick={() => reorder(job.order, job.order - 1)}
                    disabled={job.order === 0}
                    className="text-sm bg-gray-100 px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => reorder(job.order, job.order + 1)}
                    disabled={job.order === jobs.length - 1}
                    className="text-sm bg-gray-100 px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
                  >
                    ↓
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}