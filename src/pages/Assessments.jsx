import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import "./Assessments.css";

export default function Assessments() {
  const { assessments, setAssessments } = useStore();
  const [jobId, setJobId] = useState("1");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // store user answers for conditional logic
  const [errors, setErrors] = useState({});   // store validation errors

  // Fetch assessment questions
  useEffect(() => {
    fetch(`/api/assessments/${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.assessment?.questions || []);
        setAnswers({});
        setErrors({});
      })
      .catch(() => setQuestions([]));
  }, [jobId]);

  // Add new question (builder)
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
        maxLength: null,
        condition: null, // e.g., { questionIndex: 0, value: "Yes" }
      },
    ]);
  };

  // Save assessment
  const saveAssessment = async () => {
    try {
      const res = await fetch(`/api/assessments/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  // Handle form input change
  const handleChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
    setErrors({ ...errors, [index]: null }); // reset error on change
  };

  // Runtime validation
  const validate = () => {
    const newErrors = {};
    questions.forEach((q, i) => {
      if (q.condition) {
        const conditionMet = answers[q.condition.questionIndex] === q.condition.value;
        if (!conditionMet) return; // skip validation if condition not met
      }
      const val = answers[i];
      if (q.required && !val) newErrors[i] = "This question is required";
      if (q.type === "number") {
        if (q.min != null && val < q.min) newErrors[i] = `Min value is ${q.min}`;
        if (q.max != null && val > q.max) newErrors[i] = `Max value is ${q.max}`;
      }
      if (q.maxLength != null && val?.length > q.maxLength)
        newErrors[i] = `Max length is ${q.maxLength}`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) alert("Form submitted successfully!");
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

          {questions.map((q, i) => (
            <div key={i} className="question-item">
              <input
                type="text"
                value={q.label}
                placeholder="Question Label"
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

              {/* Options for radio/checkbox */}
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

              {/* Validation rules */}
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
                  />
                  Required
                </label>

                {q.type === "number" && (
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

                <input
                  type="number"
                  placeholder="Max Length (for text)"
                  value={q.maxLength ?? ""}
                  onChange={(e) => {
                    const copy = [...questions];
                    copy[i].maxLength = e.target.value ? Number(e.target.value) : null;
                    setQuestions(copy);
                  }}
                />

                {/* Conditional question */}
                {questions.length > 1 && (
                  <div className="conditional">
                    Show only if question #
                    <select
                      value={q.condition?.questionIndex ?? ""}
                      onChange={(e) => {
                        const copy = [...questions];
                        const idx = e.target.value !== "" ? Number(e.target.value) : null;
                        copy[i].condition = idx != null ? { questionIndex: idx, value: "Yes" } : null;
                        setQuestions(copy);
                      }}
                    >
                      <option value="">None</option>
                      {questions.map((_, idx) =>
                        idx !== i ? (
                          <option key={idx} value={idx}>
                            {idx + 1}
                          </option>
                        ) : null
                      )}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button className="save-assessment-btn" onClick={saveAssessment}>
            💾 Save Assessment
          </button>
        </div>

        {/* Preview / Runtime Form */}
        <div className="preview">
          <h3>Preview</h3>
          <form onSubmit={handleSubmit}>
            {questions.map((q, i) => {
              // Conditional display
              if (q.condition) {
                const conditionMet =
                  answers[q.condition.questionIndex] === q.condition.value;
                if (!conditionMet) return null;
              }

              return (
                <div key={i} className="question-item">
                  <label>
                    {q.label} {q.required && "*"}
                  </label>
                  {q.type === "text" && (
                    <input
                      type="text"
                      value={answers[i] ?? ""}
                      maxLength={q.maxLength || undefined}
                      required={q.required}
                      onChange={(e) => handleChange(i, e.target.value)}
                    />
                  )}
                  {q.type === "textarea" && (
                    <textarea
                      value={answers[i] ?? ""}
                      maxLength={q.maxLength || undefined}
                      required={q.required}
                      onChange={(e) => handleChange(i, e.target.value)}
                    />
                  )}
                  {q.type === "number" && (
                    <input
                      type="number"
                      value={answers[i] ?? ""}
                      min={q.min ?? undefined}
                      max={q.max ?? undefined}
                      required={q.required}
                      onChange={(e) => handleChange(i, e.target.value)}
                    />
                  )}
                  {q.type === "radio" &&
                    (q.options || []).map((opt, idx) => (
                      <label key={idx}>
                        <input
                          type="radio"
                          name={`q${i}`}
                          value={opt}
                          checked={answers[i] === opt}
                          onChange={(e) => handleChange(i, e.target.value)}
                          required={q.required}
                        />
                        {opt}
                      </label>
                    ))}
                  {q.type === "checkbox" &&
                    (q.options || []).map((opt, idx) => (
                      <label key={idx}>
                        <input
                          type="checkbox"
                          name={`q${i}`}
                          value={opt}
                          checked={(answers[i] || []).includes(opt)}
                          onChange={(e) => {
                            const copy = [...(answers[i] || [])];
                            if (e.target.checked) copy.push(opt);
                            else copy.splice(copy.indexOf(opt), 1);
                            handleChange(i, copy);
                          }}
                        />
                        {opt}
                      </label>
                    ))}
                  {q.type === "file" && <input type="file" disabled />}

                  {errors[i] && <p className="error">{errors[i]}</p>}
                </div>
              );
            })}
            <button type="submit" className="save-assessment-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
