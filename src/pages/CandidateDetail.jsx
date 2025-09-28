import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import "./CandidateDetail.css";

const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

export default function CandidateDetail({ candidateId, onBack }) {
  const { candidates } = useStore();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const c = candidates.find((c) => c.id === candidateId);
    setCandidate(c);
  }, [candidateId, candidates]);

  if (!candidate) return <p>Loading candidate details...</p>;

  return (
    <div className="candidate-detail-container">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="candidate-header">
        <h2>{candidate.name}</h2>
        <p>{candidate.email}</p>
        <span className={`stage-badge ${candidate.stage}`}>{candidate.stage}</span>
      </div>

      <h3>Timeline</h3>
      <div className="timeline">
        {stages.map((stage, idx) => (
          <div key={idx} className="timeline-item">
            <div
              className={`circle ${
                stages.indexOf(candidate.stage) >= idx ? "completed" : ""
              }`}
            ></div>
            <span>{stage}</span>
          </div>
        ))}
      </div>

      <h3>Notes</h3>
      <div className="notes-history">
        {candidate.notes?.length ? (
          candidate.notes.map((note, idx) => (
            <div key={idx} className="note-item">
              {note}
            </div>
          ))
        ) : (
          <p>No notes yet.</p>
        )}
      </div>
    </div>
  );
}
