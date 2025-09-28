import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        const found = data.jobs.find((j) => j.id === Number(jobId));
        setJob(found);
      });
  }, [jobId]);

  if (!job) return <p className="p-4">Job not found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p>Status: {job.status}</p>
      <p>Slug: {job.slug}</p>
      <p>Tags: {job.tags?.join(", ")}</p>
    </div>
  );
}
