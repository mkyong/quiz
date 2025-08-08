import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ThemeToggle from "../ToggleTheme";
import MarkdownRenderer from "../MarkdownRenderer";
import QuizAnswerReview from "./QuizAnswerReview";
import QuizResultShareBox from "./QuizResultShareBox";

export default function QuizResultPublic() {
  const { shareCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // --- load shared result ---
  const load = async (signal) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/quiz-results/${shareCode}`, { signal });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Result not found");
      }
      const json = await res.json();
      setResult(json);
    } catch (e) {
      if (e.name !== "AbortError") {
        setError("Quiz result not found or has expired. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [shareCode]);

  // --- parse payload (ALWAYS call the hook to satisfy rules-of-hooks) ---
  const parsed = useMemo(() => {
    try {
      if (!result) return { quiz: null, answers: [], correctAnswers: [] };

      const rawQuiz = JSON.parse(result.quizJson || "{}");
      const answers = JSON.parse(result.userAnswersJson || "[]");
      const correctAnswers = JSON.parse(result.correctAnswersJson || "[]");

      // inject correctOptionIndex for AnswerReview
      const quiz = rawQuiz?.questions?.length
        ? {
            ...rawQuiz,
            questions: rawQuiz.questions.map((q, i) => ({
              ...q,
              correctOptionIndex:
                typeof q.correctOptionIndex === "number"
                  ? q.correctOptionIndex
                  : correctAnswers?.[i],
            })),
          }
        : rawQuiz;

      return { quiz, answers, correctAnswers, parseFailed: false };
    } catch {
      return { quiz: null, answers: [], correctAnswers: [], parseFailed: true };
    }
  }, [result]);

  const { quiz, answers, correctAnswers, parseFailed } = parsed;

  const total = quiz?.questions?.length || 0;

  const correctCount = useMemo(() => {
    if (!Array.isArray(answers) || !Array.isArray(correctAnswers)) return 0;
    let s = 0;
    for (let i = 0; i < Math.min(answers.length, correctAnswers.length); i++) {
      if (answers[i] === correctAnswers[i]) s++;
    }
    return s;
  }, [answers, correctAnswers]);

  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  // --- UI states ---
  if (loading) {
    return (
      <div className="min-h-screen quiz-bg quiz-text py-10 px-4">
        <div className="quiz-layout">
          <header className="quiz-flex mb-6">
            <a href="/quiz" className="quiz-btn-neutral">&larr; Back to Quiz List</a>
            <ThemeToggle />
          </header>

          <div className="quiz-box animate-pulse mb-4">
            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-4" />
            <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-2" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
          </div>

          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="quiz-box animate-pulse">
                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-3" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || parseFailed || !result || !quiz) {
    return (
      <div className="min-h-screen quiz-bg quiz-text py-10 px-4">
        <div className="quiz-layout">
          <header className="quiz-flex mb-6">
            <a href="/quiz" className="quiz-btn-neutral">&larr; Back to Quiz List</a>
            <ThemeToggle />
          </header>

          <div className="quiz-error-box">
            <div className="quiz-error-text mb-3">
              {error || (parseFailed ? "Failed to parse shared result." : "Unable to load this shared result.")}
            </div>
            <div className="flex gap-2">
              <button className="quiz-btn-primary" onClick={() => load()}>
                Retry
              </button>
              <a href="/quiz" className="quiz-btn-neutral">Go to Quiz List</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- main ---
  return (
    <div className="min-h-screen quiz-bg quiz-text py-10 px-4">
      <div className="quiz-layout">
        <header className="quiz-flex mb-8">
          <a href="/quiz" className="quiz-btn-neutral">&larr; Back to Quiz List</a>
          <ThemeToggle />
        </header>

        <h2 className="quiz-title mb-4">{quiz.title} — Result</h2>

        <div className="quiz-box mb-6">
          <div>
            <span className="font-semibold">{correctCount}</span> of {total} correct
          </div>
          <div className="quiz-title text-4xl pt-2 pb-2">
            Score: {percent}%
          </div>
          
        </div>

        {/* Reuse the Share Box */}
        <QuizResultShareBox
          shareUrl={shareUrl}
          loading={false}
          error=""
          onRetry={null}
        />

        <QuizAnswerReview quiz={quiz} answers={answers} />

        <a href="/quiz" className="mt-10 w-full inline-flex justify-center quiz-btn-neutral">
          Back to Quiz List
        </a>
      </div>
    </div>
  );
}
