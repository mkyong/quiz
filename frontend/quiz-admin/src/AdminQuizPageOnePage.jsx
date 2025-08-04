import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const emptyQuiz = { title: "", questions: [] };
const emptyQuestion = { text: "", options: ["", ""], correctOptionIndex: 0 };

function AdminQuizPage() {
  const [error, setError] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch quizzes on initial load
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Reset error whenever form is opened/closed or editingQuiz changes
  useEffect(() => {
    setError("");
  }, [showForm, editingQuiz]);

  // Fetch quizzes from API
  const fetchQuizzes = async () => {
    const res = await axios.get("/api/quizzes");
    setQuizzes(res.data);
  };

  const handleEditQuiz = (quiz) => {
    // Deep copy for editing
    setEditingQuiz(JSON.parse(JSON.stringify(quiz)));
    setShowForm(true);
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm("Delete this quiz?")) {
      await axios.delete(`/api/quizzes/${id}`);
      fetchQuizzes();
    }
  };

  const handleAddQuiz = () => {
    setEditingQuiz({ ...emptyQuiz, questions: [] });
    setShowForm(true);
  };

  const handleQuizFormChange = (e) => {
    setEditingQuiz({ ...editingQuiz, [e.target.name]: e.target.value });
  };

  // --- Question CRUD ---
  const handleAddQuestion = () => {
    setEditingQuiz({
      ...editingQuiz,
      questions: [...editingQuiz.questions, { ...emptyQuestion }]
    });
  };

  const handleQuestionChange = (qi, key, value) => {
    const updatedQuestions = editingQuiz.questions.map((q, idx) =>
      idx === qi ? { ...q, [key]: value } : q
    );
    setEditingQuiz({ ...editingQuiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qi, oi, value) => {
    const updatedQuestions = editingQuiz.questions.map((q, idx) => {
      if (idx === qi) {
        const newOptions = [...q.options];
        newOptions[oi] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    setEditingQuiz({ ...editingQuiz, questions: updatedQuestions });
  };

  const handleAddOption = (qi) => {
    const updatedQuestions = editingQuiz.questions.map((q, idx) => {
      if (idx === qi) {
        return { ...q, options: [...q.options, ""] };
      }
      return q;
    });
    setEditingQuiz({ ...editingQuiz, questions: updatedQuestions });
  };

  const handleRemoveOption = (qi, oi) => {
    const updatedQuestions = editingQuiz.questions.map((q, idx) => {
      if (idx === qi && q.options.length > 2) {
        const newOptions = q.options.filter((_, i) => i !== oi);
        // Adjust correctOptionIndex if needed
        let newCorrectIndex = q.correctOptionIndex;
        if (oi < q.correctOptionIndex) newCorrectIndex -= 1;
        if (newCorrectIndex >= newOptions.length) newCorrectIndex = 0;
        return { ...q, options: newOptions, correctOptionIndex: newCorrectIndex };
      }
      return q;
    });
    setEditingQuiz({ ...editingQuiz, questions: updatedQuestions });
  };

  const handleRemoveQuestion = (qi) => {
    setEditingQuiz({
      ...editingQuiz,
      questions: editingQuiz.questions.filter((_, idx) => idx !== qi)
    });
  };

  // --- Submit Form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset before submit

    try {

      if (editingQuiz.id) {
        // Update
        await axios.put(`/api/quizzes/${editingQuiz.id}`, editingQuiz);
      } else {
        // Create
        await axios.post("/api/quizzes", editingQuiz);
      }
      setShowForm(false);
      fetchQuizzes();

    } catch (err) {
      // Axios error: get message from response or generic error
      setError(
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "An unknown error occurred."
      );
    }

  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="w-full max-w-screen-lg mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800">Quiz Admin</h1>
          {!showForm && (
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition"
              onClick={handleAddQuiz}
              title="Add new quiz"
            >
              {/* <Plus size={18}/> */} + New Quiz
            </button>
          )}
        </header>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300 text-sm">
            {error}
          </div>
        )}

        {!showForm && (
          <section className="space-y-4">
            {quizzes.length === 0 && (
              <div className="text-neutral-400 text-center">No quizzes found.</div>
            )}
            {quizzes.map((q) => (
              <div key={q.id}
                className="flex items-center justify-between bg-white rounded-2xl shadow p-4 transition hover:shadow-lg"
              >
                <div>
                  <div className="font-bold text-lg text-neutral-900">{q.title}</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {q.questions?.length ?? 0} questions
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg px-3 py-1 text-sm transition"
                    onClick={() => handleEditQuiz(q)}
                    title="Edit"
                  >
                    {/* <Edit size={16}/> */} Edit
                  </button>
                  <button
                    className="bg-red-100 hover:bg-red-300 text-red-600 rounded-lg px-3 py-1 text-sm transition"
                    onClick={() => handleDeleteQuiz(q.id)}
                    title="Delete"
                  >
                    {/* <Trash2 size={16}/> */} Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Quiz Form */}
        {showForm && editingQuiz && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-2xl p-8 mt-4"
            autoComplete="off"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingQuiz.id ? "Edit Quiz" : "Create New Quiz"}
            </h2>
            <div className="mb-6">
              <label className="block text-neutral-700 text-sm font-medium mb-1">
                Title
                <input
                  type="text"
                  name="title"
                  className="mt-2 block w-full rounded-xl border border-neutral-300 p-2 bg-neutral-100 focus:bg-white focus:ring-2 focus:ring-blue-300 outline-none transition"
                  value={editingQuiz.title}
                  onChange={handleQuizFormChange}
                  required
                  placeholder="Quiz title"
                />
              </label>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-neutral-700">Questions</span>
                <button
                  type="button"
                  className="text-blue-700 hover:underline font-semibold"
                  onClick={handleAddQuestion}
                >
                  + Add Question
                </button>
              </div>
              <div className="space-y-4">
                {editingQuiz.questions.map((q, qi) => (
                  <div key={qi} className="bg-neutral-100 p-4 rounded-xl shadow flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-semibold">Question #{qi + 1}</span>
                      <button
                        type="button"
                        className="ml-3 px-2 py-1 text-xs text-red-500 hover:text-white hover:bg-red-400 rounded transition"
                        onClick={() => handleRemoveQuestion(qi)}
                      >
                        Remove
                      </button>
                    </div>
                    {/* QUESTION TEXTAREA + PREVIEW */}
                    <label className="block mb-1 font-medium text-neutral-700">Question (Markdown/code supported):</label>
                    
                    <textarea
                      className="border border-neutral-300 rounded-xl px-3 py-2 font-mono min-h-[140px] sm:min-h-[180px] w-full resize-y bg-white focus:ring-2 focus:ring-blue-300 outline-none transition"
                      value={q.text}
                      onChange={e => handleQuestionChange(qi, "text", e.target.value)}
                      required
                      placeholder="Enter your coding question (Markdown/code supported)"
                    />
                    
                    
                    {/* OPTIONS */}
                    <div>
                      <div className="text-xs text-neutral-500 mb-2 font-semibold">Options (Markdown/code supported):</div>
                      <div className="flex flex-col gap-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-start gap-2">
                            <div className="flex-1 flex flex-col gap-1">
                              
                              <textarea
                                className="border border-neutral-300 rounded-lg px-2 py-1 font-mono min-h-[140px] sm:min-h-[180px] w-full resize-y bg-white"
                                value={opt}
                                onChange={e => handleOptionChange(qi, oi, e.target.value)}
                                required
                                placeholder={`Option ${oi + 1} (Markdown/code supported)`}
                              />

                              
                            </div>
                            <input
                              type="radio"
                              name={`correct-${qi}`}
                              checked={q.correctOptionIndex === oi}
                              onChange={() => handleQuestionChange(qi, "correctOptionIndex", oi)}
                              className="accent-blue-600 mt-3"
                              title="Correct answer"
                            />
                            {q.options.length > 2 && (
                              <button
                                type="button"
                                className="px-2 py-0 text-xs text-red-600 hover:bg-red-200 rounded self-start mt-3"
                                onClick={() => handleRemoveOption(qi, oi)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="text-blue-500 text-xs hover:underline mt-1"
                          onClick={() => handleAddOption(qi)}
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl transition"
                onClick={handleAddQuestion}
                title="Add another question"
              >
                + Add Question
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-neutral-300 hover:bg-neutral-400 text-neutral-700 font-semibold px-6 py-2 rounded-xl transition"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}

export default AdminQuizPage;