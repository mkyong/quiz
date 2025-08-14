import React, { useState, useEffect } from "react";
import { fetchQuizzes } from "../api/quizApi";
import ThemeToggle from "./ToggleTheme";
import QuizRunner from "./QuizRunner";
import ErrorBox from "./ErrorBox";

function toArray(data) {
  if (Array.isArray(data)) return data;
  // Try common server shapes
  if (Array.isArray(data?.quizzes)) return data.quizzes;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export default function QuizUserPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchQuizzes();
        const list = toArray(data);
        if (!list.length && !Array.isArray(data)) {
          console.warn("Unexpected quizzes payload:", data);
        }
        setQuizzes(list);
      } catch (e) {
        console.error("fetchQuizzes failed:", e);
        setError("Failed to load quizzes");
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    })();
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
        <ErrorBox message={error} />

        {quizzes.length === 0 ? (
          <div className="quiz-muted">No quizzes available.</div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((q) => (
              <div key={q.id ?? q.title} className="quiz-box quiz-flex">
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
        )}
      </div>
    </div>
  ) : (
    <QuizRunner quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />
  );
}
