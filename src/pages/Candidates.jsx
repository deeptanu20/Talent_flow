// Candidates.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import CandidateDetail from "./CandidateDetail";
import "./Candidates.css";

const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

export default function Candidates() {
  const { candidates, setCandidates, updateCandidate } = useStore();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Load candidates from API
  useEffect(() => {
    setLoading(true);
    fetch("/api/candidates")
      .then((res) => res.json())
      .then((data) => setCandidates(data.candidates))
      .finally(() => setLoading(false));
  }, [setCandidates]);

  // Filter candidates by search
  const filteredCandidates = useMemo(() => {
    if (!search) return candidates;
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [candidates, search]);

  // Move candidate stage
  const moveStage = async (id, newStage) => {
    const prev = [...candidates];
    updateCandidate(id, { stage: newStage });

    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setCandidates(prev);
      alert("Stage update failed");
    }
  };

  // Show candidate detail view
  if (selectedCandidate) {
    return (
      <CandidateDetail
        candidateId={selectedCandidate}
        onBack={() => setSelectedCandidate(null)}
      />
    );
  }

  return (
    <div className="candidates-container">
      <h2 className="page-title">Candidates Dashboard</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading && <p className="loading">Loading candidates...</p>}

      <div className="stages-grid">
        {stages.map((stage) => {
          const stageCandidates = filteredCandidates.filter(
            (c) => c.stage === stage
          );

          return (
            <div key={stage} className="stage-column">
              <h3 className="stage-title">{stage.toUpperCase()}</h3>
              <div className="candidate-list">
                {stageCandidates.map((c) => (
                  <div
                    key={c.id}
                    className="candidate-item"
                    onClick={() => setSelectedCandidate(c.id)}
                  >
                    <div className="candidate-info">
                      <span className="candidate-name">{c.name}</span>
                      <span className="candidate-email">{c.email}</span>
                    </div>
                    <select
                      value={c.stage}
                      onClick={(e) => e.stopPropagation()} // prevent click on card
                      onChange={(e) => moveStage(c.id, e.target.value)}
                      className="stage-select"
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
