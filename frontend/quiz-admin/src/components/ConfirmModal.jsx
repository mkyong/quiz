import React, { useEffect, useRef } from "react";

export default function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  const modalRef = useRef();

  // Focus trapping and Escape support
  useEffect(() => {
    if (!open) return;
    // Focus first button when modal opens
    const firstButton = modalRef.current?.querySelector("button");
    if (firstButton) firstButton.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
      // Basic focus trap
      if (e.key === "Tab") {
        const focusables = modalRef.current.querySelectorAll("button");
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={onCancel} // Click on backdrop closes modal
    >
      <div
        ref={modalRef}
        className="animate-modal-in bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 max-w-sm w-full outline-none"
        role="document"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        onClick={e => e.stopPropagation()} // Prevent click-inside from closing
      >
        <div id="modal-title" className="mb-4 text-lg font-bold text-neutral-800 dark:text-neutral-100">
          {title}
        </div>
        <div id="modal-desc" className="mb-6 text-neutral-700 dark:text-neutral-200">
          {message}
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-neutral-200 dark:bg-neutral-800 px-5 py-2 rounded-xl text-neutral-900 dark:text-neutral-100 font-semibold"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}