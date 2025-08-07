import React, { useState, useEffect } from "react";
import { fetchQuizzes } from "../api/quizApi";
import ThemeToggle from "./ToggleTheme";
import QuizRunner from "./QuizRunner";
import ErrorBox from "./ErrorBox";

function QuizUserPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes().then(setQuizzes).catch(() => setError("Failed to load quizzes")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return !selectedQuiz ? (
    <div className="min-h-screen quiz-bg quiz-text py-10 px-4">
      <div className="quiz-layout">
        <header className="quiz-flex mb-8">
          <a href="/" className="quiz-title">Quiz App</a>
          <ThemeToggle />
        </header>
        <h1 className="text-xl font-bold mb-4">Select a Quiz to Start</h1>
        <ErrorBox message={error} onDismiss={() => setError("")} />
        <div className="space-y-4">
          {quizzes.map(q => (
            <div key={q.id} className="quiz-box quiz-flex">
              <div>
                <div className="font-bold text-lg">{q.title}</div>
                <div className="quiz-muted">{q.description}</div>
                <div className="quiz-muted mt-2">{q.questions?.length ?? 0} questions</div>
              </div>
              <button className="quiz-btn-primary" onClick={() => setSelectedQuiz(q)}>
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