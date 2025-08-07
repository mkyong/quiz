import React, { useRef, useState, useEffect } from "react";
import ThemeToggle from "./ToggleTheme";
import MarkdownRenderer from "./MarkdownRenderer";
import QuizResult from "./result/QuizResult";
import WarningMessage from "./WarningBox";
import ConfirmModal from "./ConfirmModal";
import { submitQuizResult } from "../api/quizApi";

export default function QuizRunner({ quiz, onBack }) {

  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [page, setPage] = useState(0);
  const [showSelectMsg, setShowSelectMsg] = useState(false);
  const shakeRef = useRef();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const currentQuestion = quiz.questions[page];

  const [submittedResult, setSubmittedResult] = useState(null);

  useEffect(() => {
    setShowSelectMsg(false);
  }, [page]);

  const handleFinalSubmit = async () => {
    const quizJson = JSON.stringify(quiz);
    const userAnswersJson = JSON.stringify(answers);
    const correctAnswersJson = JSON.stringify(quiz.questions.map(q => q.correctOptionIndex));
    const score = answers.reduce((s, a, i) => a === quiz.questions[i].correctOptionIndex ? s + 1 : s, 0);

    const payload = {
      quizJson,
      userAnswersJson,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswersJson,
    };

    try {
      const result = await submitQuizResult(payload); // { shareCode: "abc", ... }
      setSubmittedResult({ quiz, answers, shareCode: result.shareCode });
    } catch (e) {
      alert("Failed to submit result!");
    }
  };
  
  // Render
  if (submittedResult){
    return (
      <QuizResult
        quiz={submittedResult.quiz}
        answers={submittedResult.answers}
        shareCode={submittedResult.shareCode}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen quiz-bg quiz-text py-10 px-4">
      <div className="quiz-layout">
        <header className="quiz-flex mb-8">
          <button onClick={onBack} className="quiz-btn-primary">&larr; Back To Quiz Selection</button>
          <ThemeToggle />
        </header>
        <div className="mb-3 quiz-muted">
          <b>Quiz: {quiz.title}</b>
        </div>
        <div className="mb-4">
          <div className="quiz-flex">
            <span className="font-semibold text-xl">Question {page + 1} of {quiz.questions.length}</span>
          </div>
          <div className="mt-4 mb-4 quiz-box p-4 rounded-xl min-h-[120px] font-semibold">
            <MarkdownRenderer>{currentQuestion.text}</MarkdownRenderer>
          </div>

          {showSelectMsg && (
            <WarningMessage ref={shakeRef} />
          )}

          <div className="mt-4 space-y-2">
          {currentQuestion.options.map((opt, i) => (
            <label
              key={i}
              className={`quiz-option  ${
                answers[page] === i
                  ? "quiz-option-selected"
                  : "quiz-option-default"
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
                className="quiz-radio-input"
              />
              <span className="quiz-option-letter">{String.fromCharCode(65 + i)}.</span>
              <span className="quiz-option-text">
                <MarkdownRenderer>{opt}</MarkdownRenderer>
              </span>
            </label>
          ))}
        </div>

        </div>
        <div className="quiz-flex mt-8">
          <button className="quiz-btn quiz-btn-neutral"
            onClick={() => {
              setShowSelectMsg(false);
              setPage(p => Math.max(0, p - 1))
            }} disabled={page === 0}>Previous</button>
          {page < quiz.questions.length - 1 ? (
            <button
              className="quiz-btn quiz-btn-primary"
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
            <button className="quiz-btn quiz-btn-success"
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
              confirmText="Confirm"
              cancelText="Cancel"
              onConfirm={() => {
                setConfirmOpen(false);
//                setSubmitted(true);
                handleFinalSubmit();
              }}
              onCancel={() => setConfirmOpen(false)}
            />

        </div>
      </div>
    </div>
    
  );
}
