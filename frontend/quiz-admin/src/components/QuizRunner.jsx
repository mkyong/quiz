import React, { useRef, useState, useEffect } from "react";
import ThemeToggle from "./ToggleTheme";
import MarkdownRenderer from "./MarkdownRenderer";
import QuizResult from "./result/QuizResult";
import WarningMessage from "./WarningBox";
import ConfirmModal from "./ConfirmModal";
import { submitQuizResult } from "../api/quizApi";
import axios from "axios";

export default function QuizRunner({ quiz, onBack }) {

  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));

  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareCode, setShareCode] = useState(null);
  const [saveError, setSaveError] = useState("");

  const [page, setPage] = useState(0);
  const [showSelectMsg, setShowSelectMsg] = useState(false);
  const shakeRef = useRef();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const currentQuestion = quiz.questions[page];

  const [submittedResult, setSubmittedResult] = useState(null);

  useEffect(() => {
    setShowSelectMsg(false);
  }, [page]);

  const doSave = async () => {

    setSaving(true);
    setSaveError("");

    try {

      const score = answers.reduce((s, a, i) => a === quiz.questions[i].correctOptionIndex ? s + 1 : s, 0);
      const payload = {
        quizJson: JSON.stringify(quiz),
        userAnswersJson: JSON.stringify(answers),
        correctAnswersJson: JSON.stringify(quiz.questions.map(q => q.correctOptionIndex)),
        score,
        totalQuestions: quiz.questions.length,
      };

      const saved = await submitQuizResult(payload); // may throw if backend is down/500
      setShareCode(saved.shareCode);

    } catch (e) {
      // Build a specific, user-facing error
      let msg = "Failed to generate share link.";
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        if (!e.response) {
          // Network error, ECONNREFUSED, CORS, server offline
          msg += " The server is unreachable.";
        } else if (status >= 500) {
          msg += ` Server error (${status}).`;
        } else if (status === 429) {
          msg += " Rate limit exceeded. Try again later.";
        } else if (status >= 400) {
          msg += ` Request failed (${status}).`;
        }
        if (e.response?.data?.message) {
          msg += ` ${e.response.data.message}`;
        }
      } else if (e instanceof Error && e.message) {
        msg += ` ${e.message}`;
      }
      msg += " You can retry.";

      setSaveError(msg);
      setShareCode(null); // ensure we stay in 'no link' state
      console.error(e);
    }finally {
      setSaving(false);
    }

  };
  
  const handleSubmit = async () => {
    // Basic guard — you can keep your existing validation
    if (answers.some(a => a == null)) {
      // show your existing UX
      return;
    }
   
    setShowResult(true); // show local result immediately
    setShareCode(null);  // ensure no URL yet
    doSave();            // start saving in background

  };

  if (showResult) {
    return (
      // when rendering the local result
      <QuizResult
        quiz={quiz}
        answers={answers}
        shareCode={shareCode}          // null until success
        onBack={onBack}
        shareLoading={saving}          // shows skeleton while waiting
        shareError={saveError}         // shows error + retry when failed
        onShareRetry={doSave}          // retry handler
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
                handleSubmit();
              }}
              onCancel={() => setConfirmOpen(false)}
            />

        </div>
      </div>
    </div>
    
  );
}
