import { CheckCircle, UserCheck } from "lucide-react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import MarkdownRenderer from "../MarkdownRenderer";

export default function AnswerReview({ quiz, answers }) {
  return (
    <div className="mt-8 space-y-8">
      <h3 className="quiz-title text-xl mb-4">
        Answer Review & Explanation
      </h3>
      {quiz.questions.map((q, i) => (
        <div
          key={i}
          className="quiz-box"
        >
          <div className="mb-4 font-bold">
            Question {i + 1}: 
          </div>
          <div className="mb-8">
            <MarkdownRenderer>{q.text}</MarkdownRenderer>
          </div>
          <div className="space-y-2 mb-1">

            {q.options.map((opt, oi) => {
              
              const isCorrect = q.correctOptionIndex === oi;
              const isUser = answers[i] === oi && typeof answers[i] === "number";
   
              return (

                <div
                  key={oi}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded
                    ${isCorrect
                      ? "quiz-option-correct"
                      : isUser
                      ? "quiz-option-error"
                      : "quiz-option-no-hover"}
                  `}
                >
                    
                  <span
                    className={`
                      w-6 h-6 flex items-center justify-center rounded-xl text-xs font-bold
                      ${
                        isCorrect
                          ? "bg-green-500 text-white"
                          : isUser
                          ? "bg-red-500 text-white"
                          : "bg-neutral-300 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100"
                      }
                    `}
                    title={
                      isCorrect
                        ? "Correct Answer"
                        : isUser
                        ? "Your Answer"
                        : ""
                    }
                  >
                    {String.fromCharCode(65 + oi)}
                  </span>
                  
                <span className="w-full">
                    <MarkdownRenderer>{opt}</MarkdownRenderer>
                </span>

                  {isCorrect && (
                    <FaCheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {isUser && !isCorrect && (
                    <FaTimesCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              );
              
            })}
          </div>
          <div className="text-sm mt-2">
            <div
              className="w-full px-4 py-3 rounded quiz-explanation
               font-semibold shadow-sm overflow-x-auto break-words"
              style={{
                minWidth: 0,
                wordBreak: "break-word",
                boxSizing: "border-box",
                textAlign: "left",
              }}
            >
              <div className="mt-2">
                <MarkdownRenderer>{q.correctOptionExplain}</MarkdownRenderer>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
