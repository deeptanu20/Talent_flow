import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";

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
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setCandidates(prev); // rollback
      alert("Stage update failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Candidates</h2>
      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-6 gap-4">
        {stages.map((stage) => (
          <div key={stage} className="border rounded p-2">
            <h3 className="font-semibold capitalize mb-2">{stage}</h3>
            <ul className="space-y-1 max-h-96 overflow-y-auto">
              {candidates
                .filter((c) => c.stage === stage)
                .map((c) => (
                  <li
                    key={c.id}
                    className="p-2 border rounded bg-white flex justify-between items-center"
                  >
                    <span>{c.name}</span>
                    <select
                      value={c.stage}
                      onChange={(e) => moveStage(c.id, e.target.value)}
                      className="text-sm border rounded"
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>{s}</option>
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
