import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarkdownRenderer from "../MarkdownRenderer"; // Your existing component
import ThemeToggle from "../ToggleTheme";

export default function PublicQuizResultPage() {
  const { shareCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/quiz-results/${shareCode}`)
      .then(res => {
        if (!res.ok) throw new Error("Result not found");
        return res.json();
      })
      .then(setResult)
      .catch(() => setError("Quiz result not found or has expired."))
      .finally(() => setLoading(false));
  }, [shareCode]);

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (error) return <div className="p-12 text-center text-red-600">{error}</div>;
  if (!result) return null;

  // Parse stored JSON fields
  const quiz = JSON.parse(result.quizJson);
  const answers = JSON.parse(result.userAnswersJson);
  const correctAnswers = JSON.parse(result.correctAnswersJson);

  const score = result.score ?? answers.reduce((s, a, i) => a === correctAnswers[i] ? s + 1 : s, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-10 px-4">
      <div className="max-w-lg mx-auto">
        <header className="flex items-center justify-between mb-8">
          <a href="/quiz" className="text-blue-700 dark:text-blue-400 hover:underline">&larr; Back to Quiz List</a>
          <ThemeToggle />
        </header>
        <h2 className="text-2xl font-bold mb-4 dark:text-neutral-100">{quiz.title} - Quiz Result</h2>
        <div className="mb-4 text-lg">
          <span className="font-semibold">{score}</span> / {quiz.questions.length} correct
        </div>
        <div className="mb-8 text-neutral-600 dark:text-neutral-300">{quiz.description}</div>

        <h3 className="text-lg font-bold mb-4 dark:text-neutral-100">Quiz Answers</h3>
        {quiz.questions.map((q, i) => (
          <div key={i} className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 mb-4">
            <div className="mb-1 font-semibold">
              Q{i + 1}: <MarkdownRenderer>{q.text}</MarkdownRenderer>
            </div>
            <div className="mb-1">
              Your Answer:{" "}
              <span className={answers[i] === correctAnswers[i] ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                <MarkdownRenderer>{q.options[answers[i]] || "*Not answered*"}</MarkdownRenderer>
              </span>
            </div>
            <div>
              Correct Answer: <span className="font-bold"><MarkdownRenderer>{q.options[correctAnswers[i]]}</MarkdownRenderer></span>
            </div>
            {q.correctOptionExplain && (
              <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">
                <strong>Explanation:</strong>{" "}
                <MarkdownRenderer>{q.correctOptionExplain}</MarkdownRenderer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
