import React, { useState, useEffect } from "react";
import { fetchQuizzes, createQuiz, updateQuiz, deleteQuiz } from "../../api/quizApi";
import QuizList from "./AdminQuizList";
import QuizForm from "./AdminQuizForm";
import ThemeToggle from "../ToggleTheme";

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
    await deleteQuiz(id);
    setQuizzes(await fetchQuizzes());
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
    <div className="min-h-screen quiz-bg quiz-text py-10 px-4">
      <div className="quiz-layout">
        <header className="quiz-flex mb-8">
          
          <a href="/" className="text-3xl font-extrabold tracking-tight quiz-title focus:outline-none">
            Quiz Admin
          </a>

          <ThemeToggle />

          {!showForm && (
            <button
              className="ml-2 flex items-center gap-2 quiz-btn-primary"
              onClick={handleAddQuiz}
              title="Add new quiz"
            >+ New Quiz</button>
          )}
          
        </header>
        {error && (
          <div className="mb-6 p-3 quiz-error-box">{error}</div>
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
