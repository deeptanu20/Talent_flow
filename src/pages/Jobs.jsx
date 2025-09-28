import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { Link } from "react-router-dom";
import "./Jobs.css";

export default function Jobs() {
  const { jobs, setJobs } = useStore();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [newJob, setNewJob] = useState({ title: "" });
  const pageSize = 5;

  useEffect(() => {
    fetchJobs();
  }, [filters, page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: filters.search,
        status: filters.status,
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      const response = await fetch(`/api/jobs?${query.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data.jobs);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
      alert("Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newJob.title.trim()) return alert("Title is required");
    const slug = newJob.title.toLowerCase().replace(/\s+/g, "-");
    const job = { ...newJob, slug, status: "active", tags: [], order: total };
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error("Failed to create job");
      setNewJob({ title: "" });
      fetchJobs();
      alert("Job created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating job");
    }
  };

  const toggleArchive = async (id, status) => {
    const newStatus = status === "active" ? "archived" : "active";
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update job");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Error updating job");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="jobs-container">
      {/* Header */}
      <div className="jobs-header">
        <h2>Jobs Board</h2>
        <div className="total">Total: {total} jobs</div>
      </div>

      {/* Add Job + Filters */}
      <div className="jobs-controls">
        {/* Add Job */}
        <div className="card add-job-card">
          <div className="card-body">
            <h3>Add New Job</h3>
            <div className="add-job-inputs">
              <input
                className="input"
                type="text"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob({ ...newJob, title: e.target.value })
                }
                onKeyPress={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Enter job title..."
              />
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={!newJob.title.trim()}
              >
                Add Job
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card filters-card">
          <div className="card-body">
            <h3>Filters</h3>
            <div className="filters-inputs">
              <div className="filter-item">
                <label>Search by title</label>
                <input
                  className="input"
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, search: e.target.value })
                  }
                  placeholder="Search jobs..."
                />
              </div>
              <div className="filter-item">
                <label>Filter by status</label>
                <select
                  className="input"
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="archived">Archived Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Loading jobs...</span>
        </div>
      )}

      {/* Jobs List */}
      {!loading && (
        <div className="jobs-list-grid">
          {jobs.length === 0 ? (
            <div className="no-jobs">
              <p>No jobs found</p>
              <p>
                {filters.search || filters.status
                  ? "Try adjusting your filters"
                  : "Add your first job above!"}
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <Link to={`/jobs/${job.id}`} className="job-title">
                    {job.title}
                  </Link>
                  <span
                    className={
                      job.status === "active" ? "badge-active" : "badge-archived"
                    }
                  >
                    {job.status}
                  </span>
                </div>
                <div className="job-card-body">
                  <div className="job-meta">
                    ID: {job.id} | Slug: {job.slug}
                    {job.tags && job.tags.length > 0 && (
                      <span> | Tags: {job.tags.join(", ")}</span>
                    )}
                  </div>
                  <button
                    className={`btn ${
                      job.status === "active" ? "btn-warning" : "btn-success"
                    }`}
                    onClick={() => toggleArchive(job.id, job.status)}
                  >
                    {job.status === "active" ? "Archive" : "Restore"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= page - 1 && pageNum <= page + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  className={`btn ${pageNum === page ? "current" : "btn-secondary"}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            } else if (pageNum === page - 2 || pageNum === page + 2) {
              return (
                <span key={pageNum} className="dots">
                  ...
                </span>
              );
            }
            return null;
          })}
          <button
            className="btn btn-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Results Info */}
      {!loading && jobs.length > 0 && (
        <div className="results-info">
          Showing {page * pageSize - pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} jobs
        </div>
      )}
    </div>
  );
}
