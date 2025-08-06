import React, { useRef, useState } from "react";
import ThemeToggle from "./ToggleTheme";
import MarkdownRenderer from "./MarkdownRenderer";
import QuizResult from "./result/QuizResult";
import WarningMessage from "./WarningMessage";
import ConfirmModal from "./ConfirmModal";

export default function QuizRunner({ quiz, onBack }) {

  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [page, setPage] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showSelectMsg, setShowSelectMsg] = useState(false);
  const shakeRef = useRef();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const currentQuestion = quiz.questions[page];

  if (submitted) {
    return <QuizResult quiz={quiz} answers={answers} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-10 px-4">
      <div className="w-full max-w-screen-lg mx-auto">
        <header className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-blue-700 dark:text-blue-400 hover:underline">&larr; Back</button>
          <ThemeToggle />
        </header>
        <div className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
          Quiz: <b className="text-neutral-900 dark:text-neutral-100">{quiz.title}</b>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold dark:text-neutral-100">Question {page + 1} of {quiz.questions.length}</span>
          </div>
          <div className="mt-4 mb-4 bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl min-h-[120px] dark:text-neutral-100 font-semibold">
            <MarkdownRenderer>{currentQuestion.text}</MarkdownRenderer>
          </div>

          {showSelectMsg && (
            <WarningMessage ref={shakeRef} />
          )}

          <div className="mt-4 space-y-2">
          {currentQuestion.options.map((opt, i) => (
            <label
              key={i}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${
                answers[page] === i
                  ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
            >
              <input
                type="radio"
                checked={answers[page] === i}
                onChange={() => {
                  setAnswers((ans) => {
                    const a = [...ans];
                    a[page] = i;
                    return a;
                  });
                  setShowSelectMsg(false); // Hide the warning as soon as an answer is picked
                }}
                className="accent-blue-600 dark:accent-blue-400"
              />
              <span className="w-4 text-neutral-700 dark:text-neutral-200">{String.fromCharCode(65 + i)}.</span>
              <span className="w-full text-neutral-900 dark:text-neutral-100">
                <MarkdownRenderer>{opt}</MarkdownRenderer>
              </span>
            </label>
          ))}
        </div>

        </div>
        <div className="flex justify-between items-center mt-8">
          <button className="bg-neutral-200 dark:bg-neutral-700 px-4 py-2 rounded-xl text-neutral-700 dark:text-neutral-100 font-semibold"
            onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</button>
          {page < quiz.questions.length - 1 ? (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold"
              onClick={() => {
                if (answers[page] == null) {
                  setShowSelectMsg(true);

                  // Animation retrigger logic
                  if (shakeRef.current) {
                    shakeRef.current.classList.remove("shake");
                    // Force reflow to restart animation
                    // eslint-disable-next-line no-unused-expressions
                    void shakeRef.current.offsetWidth;
                    shakeRef.current.classList.add("shake");
                  }
                  
                } else {
                  setShowSelectMsg(false);
                  setPage(p => Math.min(quiz.questions.length - 1, p + 1));
                }
              }}
            >
              Next
            </button>
          ) : (
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold"
              onClick={() => {
                if (answers.some(a => a == null)) {
                  setShowSelectMsg(true);
                  if (shakeRef.current) {
                    shakeRef.current.classList.remove("shake");
                    void shakeRef.current.offsetWidth;
                    shakeRef.current.classList.add("shake");
                  }
                } else {
                  setShowSelectMsg(false);
                  setConfirmOpen(true);
                }
              }}
            >
              Submit
            </button>
          )}

          <ConfirmModal
              open={confirmOpen}
              title="Submit Quiz?"
              message="Are you sure you want to submit all your answers? This action cannot be undone."
              confirmText="Submit"
              cancelText="Cancel"
              onConfirm={() => {
                setConfirmOpen(false);
                setSubmitted(true);
              }}
              onCancel={() => setConfirmOpen(false)}
            />

        </div>
      </div>
    </div>
    
  );
}
