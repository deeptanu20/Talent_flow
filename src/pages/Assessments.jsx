import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import "./Assessments.css";

export default function Assessments() {
  const { assessments, setAssessments } = useStore();
  const [jobId, setJobId] = useState("1");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch(`/api/assessments/${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.assessment) setQuestions(data.assessment.questions);
        else setQuestions([]);
      });
  }, [jobId]);

  const addQuestion = () => {
    setQuestions([...questions, { type: "text", label: "New Question" }]);
  };

  const saveAssessment = async () => {
    try {
      const res = await fetch(`/api/assessments/${jobId}`, {
        method: "PUT",
        body: JSON.stringify({ questions }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAssessments([
        ...assessments.filter((a) => a.id !== jobId),
        data.assessment,
      ]);
      alert("Saved!");
    } catch {
      alert("Error saving assessment");
    }
  };

  return (
    <div className="assessments-container">
      <h2>Assessments</h2>

      <div className="job-selector">
        <label>Select Job ID:</label>
        <input
          type="number"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        />
      </div>

      <div className="assessment-grid">
        {/* Builder */}
        <div className="builder">
          <h3>Builder</h3>
          <button className="add-question-btn" onClick={addQuestion}>
            ➕ Add Question
          </button>

          <div className="question-list">
            {questions.map((q, i) => (
              <div key={i} className="question-item">
                <input
                  type="text"
                  value={q.label}
                  onChange={(e) => {
                    const copy = [...questions];
                    copy[i].label = e.target.value;
                    setQuestions(copy);
                  }}
                />
                <select
                  value={q.type}
                  onChange={(e) => {
                    const copy = [...questions];
                    copy[i].type = e.target.value;
                    setQuestions(copy);
                  }}
                >
                  <option value="text">Short Text</option>
                  <option value="textarea">Long Text</option>
                  <option value="number">Number</option>
                </select>
              </div>
            ))}
          </div>

          <button className="save-assessment-btn" onClick={saveAssessment}>
            💾 Save Assessment
          </button>
        </div>

        {/* Preview */}
        <div className="preview">
          <h3>Preview</h3>
          <form>
            {questions.map((q, i) => (
              <div key={i} className="question-item">
                <label>{q.label}</label>
                {q.type === "text" && <input type="text" />}
                {q.type === "textarea" && <textarea />}
                {q.type === "number" && <input type="number" />}
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
}
