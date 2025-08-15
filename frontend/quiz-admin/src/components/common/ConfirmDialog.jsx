import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaExclamationTriangle, FaCheckCircle, FaTimes } from "react-icons/fa";

export default function ConfirmDialog({ state, onClose }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (state.open) cancelRef.current?.focus();
  }, [state.open]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && state.open) onClose(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.open, onClose]);

  if (!state.open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-100 animate-fade-in"
        onClick={() => onClose(false)}
      />

      {/* Panel */}
      <div className="relative quiz-box w-full max-w-sm mx-4 scale-100 opacity-100 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full
                ${state.danger
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                }`}
            >
              {state.danger ? <FaExclamationTriangle /> : <FaCheckCircle />}
            </span>
            <h2 id="confirm-title" className="text-lg font-bold dark:text-neutral-100">
              {state.title}
            </h2>
          </div>
          
        </div>

        {/* Body */}
        <p id="confirm-message" className="quiz-muted mb-4">
          {state.message}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            ref={cancelRef}
            className="quiz-btn-neutral"
            onClick={() => onClose(false)}
          >
            {state.cancelText}
          </button>
          <button
            className={state.danger ? "quiz-btn-danger" : "quiz-btn-primary"}
            onClick={() => onClose(true)}
          >
            {state.confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
