import React, { useState, useEffect } from "react";
import { fetchQuizzes } from "../api/quizApi";
import ThemeToggle from "./ToggleTheme";
import QuizRunner from "./QuizRunner";

function QuizUserPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes().then(setQuizzes).catch(() => setError("Failed to load quizzes")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return !selectedQuiz ? (
    <div className="min-h-screen bg-white dark:bg-black py-10 px-4">
      <div className="w-full max-w-screen-lg mx-auto">
        <header className="flex items-center justify-between mb-8">
          <a href="/" className="text-3xl font-extrabold tracking-tight text-neutral-800 dark:text-neutral-100">Quiz App</a>
          <ThemeToggle />
        </header>
        <h1 className="text-xl font-bold mb-4 dark:text-neutral-100">Select a Quiz to Start</h1>
        <div className="space-y-4">
          {quizzes.map(q => (
            <div key={q.id} className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <div className="font-bold text-lg dark:text-neutral-100">{q.title}</div>
                <div className="text-neutral-600 dark:text-neutral-400">{q.description}</div>
                <div className="text-xs text-neutral-400 mt-1">{q.questions?.length ?? 0} questions</div>
              </div>
              <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold" onClick={() => setSelectedQuiz(q)}>
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <QuizRunner quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />
  );
}

export default QuizUserPage;