import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import "./Candidates.css";

const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

export default function Candidates() {
  const { candidates, setCandidates } = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/candidates")
      .then((res) => res.json())
      .then((data) => setCandidates(data.candidates))
      .finally(() => setLoading(false));
  }, [setCandidates]);

  const moveStage = async (id, newStage) => {
    const prev = [...candidates];
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, stage: newStage } : c)));

    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setCandidates(prev); // rollback
      alert("Stage update failed");
    }
  };

  return (
    <div className="candidates-container">
      <h2>Candidates</h2>
      {loading && <p className="loading">Loading...</p>}

      <div className="stages-grid">
        {stages.map((stage) => (
          <div key={stage} className="stage-column">
            <h3>{stage}</h3>
            <ul className="candidate-list">
              {candidates
                .filter((c) => c.stage === stage)
                .map((c) => (
                  <li key={c.id} className="candidate-item">
                    <span>{c.name}</span>
                    <select
                      value={c.stage}
                      onChange={(e) => moveStage(c.id, e.target.value)}
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
