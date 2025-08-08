import React, { useState } from "react";
import ThemeToggle from "../ToggleTheme";
import QuizAnswerReview from "./QuizAnswerReview";
import QuizFeedback from "./QuizFeedback";
import QuizResultShareBox from "./QuizResultShareBox";

export default function QuizResult({
  quiz,
  answers,
  shareCode,
  onBack,
  shareLoading = false,     // NEW
  shareError = "",          // NEW
  onShareRetry,             // NEW
}) {

  const [showReview, setShowReview] = useState(false);
  
  const shareUrl = shareCode
    ? `${window.location.origin}/quiz/result/${shareCode}`
    : null;

  const correctCount = answers.reduce(
    (s, a, i) => (a === quiz.questions[i].correctOptionIndex ? s + 1 : s),
    0
  );
  
  const percent = Math.round((correctCount / quiz.questions.length) * 100);

  return (
    <div className="min-h-screen quiz-bg quiz-text py-10 px-4">
      <div className="quiz-layout">
        <header className="quiz-flex">
          <button
            onClick={onBack}
            className="quiz-btn-neutral mb-10"
            aria-label="Back to quiz"
          >
            &larr; Back To Quiz Selection
          </button>
          <ThemeToggle />
        </header>
        <h2 className="quiz-title mb-8">
          {quiz.title} Results
        </h2>
        
        <div className="quiz-box mb-4">
            <div className="">
              Correct: {correctCount} of {quiz.questions.length}
            </div>

            <div className="quiz-title text-4xl pt-4 pb-4">
              Score: {percent}%
            </div>
            
            <QuizFeedback percent={percent} />
        </div>
        
        <QuizResultShareBox
          shareUrl={shareUrl}
          loading={!shareUrl && shareLoading}
          error={shareError}
          onRetry={onShareRetry}
        />

        <button
          className={`mt-4 px-6 py-2 rounded-xl font-semibold w-full transition quiz-btn-primary`}
          onClick={() => setShowReview((prev) => !prev)}
        >
          {showReview ? "Hide Answers & Explanation" : "Reveal Answers & Explanation"}
        </button>

        {showReview && <QuizAnswerReview quiz={quiz} answers={answers} />}

        {onBack && (
          <button className="mt-10 w-full quiz-btn-neutral" onClick={onBack}>
            Back to Quiz List
          </button>
        )}

      </div>
    </div>
  );
}
