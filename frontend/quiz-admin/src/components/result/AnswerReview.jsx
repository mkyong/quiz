import { CheckCircle, UserCheck } from "lucide-react";
import MarkdownRenderer from "../MarkdownRenderer";

export default function AnswerReview({ quiz, answers }) {
  return (
    <div className="mt-8 space-y-8">
      <h3 className="text-lg font-bold dark:text-neutral-100 mb-4">
        Answer Review & Explanation
      </h3>
      {quiz.questions.map((q, i) => (
        <div
          key={i}
          className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-5 shadow flex flex-col gap-2"
        >
          <div className="font-semibold text-base dark:text-neutral-100 mb-1">
            Question {i + 1}: <MarkdownRenderer>{q.text}</MarkdownRenderer>
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
                      ? "bg-green-50 dark:bg-green-900 border border-green-500"
                      : isUser
                      ? "bg-yellow-50 dark:bg-yellow-900 border border-yellow-500"
                      : "border border-neutral-300 dark:border-neutral-700"}
                  `}
                >
                    
                  <span
                    className={`
                      w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                      ${
                        isCorrect
                          ? "bg-green-500 text-white"
                          : isUser
                          ? "bg-yellow-500 text-white"
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
                  
                <span className="w-full text-neutral-900 dark:text-neutral-100">
                    <MarkdownRenderer>{opt}</MarkdownRenderer>
                </span>

                  {isCorrect && (
                    <CheckCircle
                      className="ml-1 text-green-600 dark:text-green-400"
                      size={20}
                      strokeWidth={2.2}
                      aria-label="Correct answer"
                      title="Correct answer"
                    />
                  )}
                  {isUser && !isCorrect && (
                    <UserCheck
                      className="ml-1 text-yellow-500 dark:text-yellow-300"
                      size={20}
                      strokeWidth={2.2}
                      aria-label="Your answer"
                      title="Your answer"
                    />
                  )}
                </div>
              );
              
            })}
          </div>
          <div className="text-sm mt-2">
            <div
              className="w-full px-4 py-3 rounded bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow-sm overflow-x-auto break-words"
              style={{
                minWidth: 0,
                wordBreak: "break-word",
                boxSizing: "border-box",
                textAlign: "left",
              }}
            >
              <b>Explanation:</b>{" "}
              <MarkdownRenderer>{q.correctOptionExplain}</MarkdownRenderer>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
