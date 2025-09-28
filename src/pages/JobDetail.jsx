import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetail.css";

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        const found = data.jobs.find((j) => j.id === Number(jobId));
        setJob(found);
        setFormData(found || {});
      });
  }, [jobId]);

  if (!job) return <p className="p-4">Job not found.</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setJob(data.job);
      setEditMode(false);
      alert("Job updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating job");
    }
  };

  return (
    <div className={`job-detail-container ${darkMode ? "dark" : ""}`}>
      <div className="darkmode-toggle">
        <label>
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          Dark Mode
        </label>
      </div>

      {editMode ? (
        <div className="edit-form">
          <label>Title:</label>
          <input name="title" value={formData.title || ""} onChange={handleChange} />

          <label>Description:</label>
          <textarea name="description" value={formData.description || ""} onChange={handleChange} />

          <label>Status:</label>
          <select name="status" value={formData.status || "active"} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="pending">Pending</option>
          </select>

          <label>Tags (comma separated):</label>
          <input
            name="tags"
            value={formData.tags?.join(", ") || ""}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })}
          />

          <div className="job-actions">
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
            <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h2>{job.title}</h2>

          <div className="job-status-wrapper">
            <span className={`job-status ${job.status}`}>{job.status}</span>
            <span className="job-date">Posted: {job.postedAt || "N/A"}</span>
          </div>

          <div className="job-meta-cards">
            <div className="meta-card">ID: {job.id}</div>
            <div className="meta-card">Slug: {job.slug}</div>
            {job.tags?.map((tag, idx) => (
              <div key={idx} className="meta-card tag-card">{tag}</div>
            ))}
          </div>

          <h3>Description</h3>
          <p>{job.description || "No description available."}</p>

          {job.requirements?.length > 0 && (
            <>
              <h3>Requirements</h3>
              <ul>
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </>
          )}

          <div className="job-actions">
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Job</button>
            <button
              className={`btn ${job.status === "active" ? "btn-warning" : "btn-success"}`}
              onClick={() => alert(`${job.status === "active" ? "Archive" : "Restore"} clicked`)}
            >
              {job.status === "active" ? "Archive" : "Restore"}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </>
      )}
    </div>
  );
}
