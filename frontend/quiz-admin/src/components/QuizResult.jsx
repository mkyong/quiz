import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import MarkdownRenderer from "./MarkdownRenderer";
import ThemeToggle from "./ToggleTheme";
import { CheckCircle, UserCheck } from "lucide-react";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register Chart.js modules
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function QuizResult({ quiz, answers, onBack }) {
  const [reveal, setReveal] = useState(false);
  const correctCount = answers.reduce(
    (s, a, i) => (a === quiz.questions[i].correctOptionIndex ? s + 1 : s),
    0
  );
  const percent = ((correctCount / quiz.questions.length) * 100).toFixed(1);

  // Professional bar chart (stacked, percent)
  const chartData = {
    labels: quiz.questions.map((_, i) => `Q${i + 1}`),
    datasets: [
      {
        label: "Correct",
        data: quiz.questions.map((q, i) =>
          answers[i] === q.correctOptionIndex ? 1 : 0
        ),
        backgroundColor: "rgba(34,197,94,0.80)",
        borderRadius: 12,
        barThickness: 32,
        borderWidth: 2,
        borderColor: "rgba(34,197,94,1)",
        order: 1,
      },
      {
        label: "Incorrect",
        data: quiz.questions.map((q, i) =>
          answers[i] === null
            ? 0
            : answers[i] === q.correctOptionIndex
            ? 0
            : 1
        ),
        backgroundColor: "rgba(239,68,68,0.60)",
        borderRadius: 12,
        barThickness: 32,
        borderWidth: 2,
        borderColor: "rgba(239,68,68,1)",
        order: 2,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "x",
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#222",
          font: { size: 15, family: "inherit" },
          boxWidth: 18,
        },
      },
      title: {
        display: true,
        text: "Question-wise Results",
        color: "#2563eb",
        font: { size: 18, weight: "bold", family: "inherit" },
        padding: { bottom: 12 },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: ctx => {
            if (ctx.dataset.label === "Correct" && ctx.raw) return "Correct";
            if (ctx.dataset.label === "Incorrect" && ctx.raw) return "Incorrect";
            return null;
          },
        },
        backgroundColor: "#fff",
        titleColor: "#2563eb",
        bodyColor: "#222",
        borderColor: "#ddd",
        borderWidth: 1,
        caretSize: 7,
        cornerRadius: 8,
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: v => (v === 1 ? "Correct" : v === 0 ? "Incorrect" : ""),
          color: "#555",
          font: { size: 14 },
        },
        grid: { color: "#e5e7eb", borderDash: [4, 2] },
      },
      x: {
        ticks: { color: "#555", font: { size: 14 } },
        grid: { color: "#e5e7eb", display: false },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

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
        <div className="mb-3 flex flex-col items-start gap-2 text-lg">
          <span className="font-semibold text-green-700 dark:text-green-400 text-xl">
            {correctCount} / {quiz.questions.length} correct
          </span>
          <span className="font-semibold text-blue-700 dark:text-blue-300 text-xl">
            Score:{" "} {percent}%
          </span>
        </div>
        <div
          className="mb-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-4"
          style={{ height: 250 }}
        >
          <Bar data={chartData} options={chartOptions} />
        </div>
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold w-full transition"
          onClick={() => setReveal(true)}
          disabled={reveal}
        >
          Reveal Answers & Explanation
        </button>
        {reveal && (
          <div className="mt-8 space-y-8">
            <h3 className="text-lg font-bold dark:text-neutral-100 mb-4">
              Answer Review & Explanation
            </h3>
            {quiz.questions.map((q, i) => (
              <div
                key={i}
                className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-5 shadow flex flex-col gap-2 border-l-4"
                style={{
                  borderColor:
                    answers[i] === q.correctOptionIndex
                      ? "#22c55e"
                      : "#ef4444",
                }}
              >
                <div className="font-semibold text-base dark:text-neutral-100 mb-1">
                  Q{i + 1}: <MarkdownRenderer>{q.text}</MarkdownRenderer>
                </div>
                <div className="space-y-2 mb-1">
                  {q.options.map((opt, oi) => {
                    const isCorrect = q.correctOptionIndex === oi;
                    const isUser = answers[i] === oi;
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
                        <span className="w-full">
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
                    <MarkdownRenderer>{q.correctOptionExplain || "No explanation provided."}</MarkdownRenderer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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