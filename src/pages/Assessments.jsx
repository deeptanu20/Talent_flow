import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";

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
      setAssessments([...assessments.filter((a) => a.id !== jobId), data.assessment]);
      alert("Saved!");
    } catch {
      alert("Error saving assessment");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assessments</h2>

      <div className="mb-4">
        <label className="mr-2">Select Job ID:</label>
        <input
          type="number"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className="border p-1 w-20"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Builder */}
        <div className="border p-4 rounded bg-white shadow-sm">
          <h3 className="font-semibold mb-2">Builder</h3>
          <button
            onClick={addQuestion}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            ➕ Add Question
          </button>

          <ul className="mt-3 space-y-3">
            {questions.map((q, i) => (
              <li key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={q.label}
                  onChange={(e) => {
                    const copy = [...questions];
                    copy[i].label = e.target.value;
                    setQuestions(copy);
                  }}
                  className="border p-1 flex-1 rounded"
                />
                <select
                  value={q.type}
                  onChange={(e) => {
                    const copy = [...questions];
                    copy[i].type = e.target.value;
                    setQuestions(copy);
                  }}
                  className="border p-1 rounded"
                >
                  <option value="text">Short Text</option>
                  <option value="textarea">Long Text</option>
                  <option value="number">Number</option>
                </select>
              </li>
            ))}
          </ul>

          <button
            onClick={saveAssessment}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            💾 Save Assessment
          </button>
        </div>

        {/* Preview */}
        <div className="border p-4 rounded bg-gray-50 shadow-sm">
          <h3 className="font-semibold mb-2">Preview</h3>
          <form className="space-y-4">
            {questions.map((q, i) => (
              <div key={i}>
                <label className="block mb-1 font-medium">{q.label}</label>
                {q.type === "text" && (
                  <input type="text" className="border p-2 w-full rounded" />
                )}
                {q.type === "textarea" && (
                  <textarea className="border p-2 w-full rounded"></textarea>
                )}
                {q.type === "number" && (
                  <input type="number" className="border p-2 w-full rounded" />
                )}
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
}
