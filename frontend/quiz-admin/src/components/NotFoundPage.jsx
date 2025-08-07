// src/components/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center quiz-bg quiz-text px-4">
      <div className="quiz-box flex flex-col items-center py-12 px-8 shadow-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <h1 className="text-7xl font-black text-blue-600 dark:text-blue-400 mb-2 drop-shadow">
          404
        </h1>
        <p className="text-2xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
          Page Not Found
        </p>
        <p className="quiz-muted mb-6 text-center max-w-md">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="quiz-btn-primary mt-4 text-lg"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
