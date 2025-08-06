import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, Title);

export default function QuizDonutChart({ quiz, answers }) {
  const total = quiz.questions.length;
  const correct = quiz.questions.reduce(
    (count, q, i) => (answers[i] === q.correctOptionIndex ? count + 1 : count),
    0
  );
  const notAnswered = answers.filter(a => typeof a !== "number").length;
  const incorrect = total - correct - notAnswered;

  const chartData = {
    labels: ["Correct", "Incorrect", ...(notAnswered > 0 ? ["Not Answered"] : [])],
    datasets: [
      {
        data: [correct, incorrect, ...(notAnswered > 0 ? [notAnswered] : [])],
        backgroundColor: [
          "rgba(34,197,94,0.90)",   // green
          "rgba(239,68,68,0.85)",   // red
          ...(notAnswered > 0 ? ["rgba(148,163,184,0.7)"] : []), // slate gray
        ],
        borderColor: [
          "rgba(22,163,74,1)",
          "rgba(220,38,38,1)",
          ...(notAnswered > 0 ? ["rgba(100,116,139,1)"] : []),
        ],
        borderWidth: 3,
        hoverOffset: 10,
      }
    ],
  };

  const chartOptions = {
    cutout: "70%", // Donut!
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#334155",
          font: { size: 16, weight: "bold", family: "inherit" },
        }
      },
      title: {
        display: true,
        text: "Score Breakdown",
        color: "#0f172a",
        font: { size: 20, weight: "bold" },
        padding: { bottom: 14 }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: ctx =>
            `${ctx.label}: ${ctx.raw} (${((ctx.raw / total) * 100).toFixed(1)}%)`
        },
        backgroundColor: "#fff",
        bodyColor: "#334155",
        borderColor: "#e5e7eb",
        borderWidth: 1.2,
        titleColor: "#1d4ed8",
        caretSize: 7,
        cornerRadius: 10,
        padding: 12,
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: "easeOutQuart" },
  };

  return (
    <div
      className="mb-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-4 flex items-center justify-center"
      style={{ minHeight: 270, maxWidth: 340, margin: "0 auto" }}
    >
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
}