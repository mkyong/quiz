import React, { useState, useEffect } from "react";
import { fetchQuizzes, createQuiz, updateQuiz, deleteQuiz } from "../api/quizApi";
import QuizList from "./QuizList";
import QuizForm from "./QuizForm";
import ThemeToggle from "./ToggleTheme";

const emptyQuiz = { title: "", description: "", questions: [] };

function AdminQuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuizzes().then(setQuizzes).catch(e => setError("Failed to load quizzes"));
  }, []);

  const handleAddQuiz = () => {
    setEditingQuiz({ ...emptyQuiz });
    setShowForm(true);
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(JSON.parse(JSON.stringify(quiz)));
    setShowForm(true);
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm("Delete this quiz?")) {
      await deleteQuiz(id);
      setQuizzes(await fetchQuizzes());
    }
  };

  const handleFormSubmit = async (quiz) => {
    setError("");
    try {
      if (quiz.id) {
        await updateQuiz(quiz.id, quiz);
      } else {
        await createQuiz(quiz);
      }
      setShowForm(false);
      setQuizzes(await fetchQuizzes());
    } catch (err) {
      setError(err.response?.data?.message || "Unknown error");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-10 px-2 sm:px-8 transition">

      <div className="w-full max-w-screen-lg mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 dark:text-neutral-100">Quiz Admin</h1>
          <ThemeToggle />
          {!showForm && (
            <button
              className="ml-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition"
              onClick={handleAddQuiz}
              title="Add new quiz"
            >+ New Quiz</button>
          )}
        </header>
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 rounded-lg border border-red-300 text-sm">{error}</div>
        )}
        {!showForm ? (
          <QuizList quizzes={quizzes} onEdit={handleEditQuiz} onDelete={handleDeleteQuiz} />
        ) : (
          <QuizForm quiz={editingQuiz} setQuiz={setEditingQuiz} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
        )}
      </div>
    </div>
  );
}

export default AdminQuizPage;
