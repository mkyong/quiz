import { X } from "lucide-react"; // Or any close icon

export default function ErrorBox({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div
      className="quiz-error-box quiz-flex mb-8 animate-fade-in"
      role="alert"
    >
      <span className="quiz-error-text flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 rounded-full border border-red-600
            bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700
            transition p-1 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4 text-red-600 dark:text-red-200" />
        </button>
      )}
    </div>
  );
}
