import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import "./Assessments.css";

export default function Assessments() {
  const { assessments, setAssessments } = useStore();
  const [jobId, setJobId] = useState("1");
  const [questions, setQuestions] = useState([]);

  // Fetch assessment questions safely
  useEffect(() => {
    fetch(`/api/assessments/${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.assessment?.questions || []); // fallback to empty array
      })
      .catch(() => setQuestions([])); // in case of fetch error
  }, [jobId]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "text",
        label: "New Question",
        options: [],
        required: false,
        min: null,
        max: null,
      },
    ]);
  };

  const saveAssessment = async () => {
    try {
      const res = await fetch(`/api/assessments/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });
      if (!res.ok) throw new Error("Failed to save");
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
            {(questions || []).map((q, i) => (
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
                  <option value="range">Number (Range)</option>
                  <option value="radio">Single Choice</option>
                  <option value="checkbox">Multiple Choice</option>
                  <option value="file">File Upload</option>
                </select>

                {(q.type === "radio" || q.type === "checkbox") && (
                  <div className="options">
                    {(q.options || []).map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={opt}
                        placeholder={`Option ${idx + 1}`}
                        onChange={(e) => {
                          const copy = [...questions];
                          copy[i].options[idx] = e.target.value;
                          setQuestions(copy);
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...questions];
                        copy[i].options = copy[i].options || [];
                        copy[i].options.push("");
                        setQuestions(copy);
                      }}
                    >
                      ➕ Add Option
                    </button>
                  </div>
                )}

                {/* Validation */}
                <div className="validation">
                  <label>
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => {
                        const copy = [...questions];
                        copy[i].required = e.target.checked;
                        setQuestions(copy);
                      }}
                    />{" "}
                    Required
                  </label>
                  {q.type === "range" && (
                    <>
                      <input
                        type="number"
                        placeholder="Min"
                        value={q.min ?? ""}
                        onChange={(e) => {
                          const copy = [...questions];
                          copy[i].min = e.target.value ? Number(e.target.value) : null;
                          setQuestions(copy);
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={q.max ?? ""}
                        onChange={(e) => {
                          const copy = [...questions];
                          copy[i].max = e.target.value ? Number(e.target.value) : null;
                          setQuestions(copy);
                        }}
                      />
                    </>
                  )}
                </div>
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
            {(questions || []).map((q, i) => (
              <div key={i} className="question-item">
                <label>
                  {q.label} {q.required && "*"}
                </label>

                {q.type === "text" && <input type="text" required={q.required} />}
                {q.type === "textarea" && <textarea required={q.required} />}
                {q.type === "number" && <input type="number" required={q.required} />}
                {q.type === "range" && (
                  <input type="number" min={q.min} max={q.max} required={q.required} />
                )}
                {q.type === "radio" &&
                  (q.options || []).map((opt, idx) => (
                    <label key={idx}>
                      <input type="radio" name={`q${i}`} value={opt} required={q.required} />
                      {opt}
                    </label>
                  ))}
                {q.type === "checkbox" &&
                  (q.options || []).map((opt, idx) => (
                    <label key={idx}>
                      <input type="checkbox" name={`q${i}`} value={opt} />
                      {opt}
                    </label>
                  ))}
                {q.type === "file" && <input type="file" disabled />}
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
}
