import React, { useState } from "react";
import ThemeToggle from "../ToggleTheme";
import QuizScoreChart from "./QuizScoreChart";
import AnswerReview from "./AnswerReview";

export default function QuizResult({ quiz, answers, onBack }) {
  const [showReview, setShowReview] = useState(false);

  const correctCount = answers.reduce(
    (s, a, i) => (a === quiz.questions[i].correctOptionIndex ? s + 1 : s),
    0
  );
  const percent = ((correctCount / quiz.questions.length) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-10 px-4">
      <div className="w-full max-w-screen-lg mx-auto">
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="text-blue-700 dark:text-blue-400 hover:underline focus:outline-none"
            aria-label="Back to quiz"
          >
            &larr; Back
          </button>
          <ThemeToggle />
        </header>
        <h2 className="text-2xl font-bold mb-2 dark:text-neutral-100">
          Quiz Completed
        </h2>
        <div className="mb-6 w-full">
            <div className="flex flex-col items-start gap-2 text-lg bg-neutral-100 dark:bg-neutral-900 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
                <span>
                <span className="font-semibold text-green-700 dark:text-green-400 text-xl">
                    {correctCount}
                </span>{" "}
                <span className="text-neutral-700 dark:text-neutral-200">/ {quiz.questions.length} correct</span>
                </span>
                <span>
                <span className="text-neutral-700 dark:text-neutral-200">Score: </span>
                <span className="font-semibold text-blue-700 dark:text-blue-300 text-xl">
                    {percent}%
                </span>
                </span>
            </div>
        </div>

        <QuizScoreChart quiz={quiz} answers={answers} />

        <button
          className={`mt-4 px-6 py-2 rounded-xl font-semibold w-full transition ${
            showReview
              ? "bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          onClick={() => setShowReview((prev) => !prev)}
        >
          {showReview ? "Hide Answers & Explanation" : "Reveal Answers & Explanation"}
        </button>

        {showReview && <AnswerReview quiz={quiz} answers={answers} />}

        <button
          className="mt-10 w-full bg-neutral-300 dark:bg-neutral-700 rounded-xl py-2 text-neutral-800 dark:text-neutral-100 font-semibold"
          onClick={onBack}
        >
          Back to Quiz List
        </button>
      </div>
    </div>
  );
}
