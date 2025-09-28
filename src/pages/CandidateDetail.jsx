import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import "./CandidateDetail.css";

const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
const users = ["Alice", "Bob", "Charlie"]; // local list for mentions

export default function CandidateDetail({ candidateId, onBack }) {
  const { candidates, updateCandidate } = useStore();
  const [candidate, setCandidate] = useState(null);
  const [note, setNote] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const c = candidates.find((c) => c.id === candidateId);
    setCandidate(c);
  }, [candidateId, candidates]);

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNote(val);

    const lastWord = val.split(" ").pop();
    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      setSuggestions(users.filter((u) => u.toLowerCase().includes(query)));
    } else {
      setSuggestions([]);
    }
  };

  const addNote = () => {
    if (!note.trim()) return;
    updateCandidate(candidate.id, { notes: [...(candidate.notes || []), note] });
    setNote("");
    setSuggestions([]);
  };

  const selectMention = (user) => {
    const words = note.split(" ");
    words.pop();
    setNote(words.join(" ") + " @" + user + " ");
    setSuggestions([]);
  };

  if (!candidate) return <p>Loading candidate details...</p>;

  return (
    <div className="candidate-detail-container">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="candidate-header">
        <h2>{candidate.name}</h2>
        <p>{candidate.email}</p>
        <span className={`stage-badge ${candidate.stage}`}>{candidate.stage}</span>
      </div>

      <h3>Timeline</h3>
      <div className="timeline">
        {stages.map((stage, idx) => (
          <div key={idx} className="timeline-item">
            <div className={`circle ${stages.indexOf(candidate.stage) >= idx ? "completed" : ""}`}></div>
            <span>{stage}</span>
          </div>
        ))}
      </div>

      <h3>Notes</h3>
      <div className="notes-history">
        {candidate.notes?.length ? candidate.notes.map((n, i) => (
          <div key={i} className="note-item">{n.replace(/@(\w+)/g, (m, u) => `<b>@${u}</b>` )}</div>
        )) : <p>No notes yet.</p>}
      </div>

      <textarea
        className="mentions-input"
        value={note}
        onChange={handleNoteChange}
        placeholder="Add a note with @mention"
      />
      {suggestions.length > 0 && (
        <div className="mention-suggestions">
          {suggestions.map((u) => <div key={u} onClick={() => selectMention(u)}>{u}</div>)}
        </div>
      )}
      <button className="save-note-btn" onClick={addNote}>Save Note</button>
    </div>
  );
}
