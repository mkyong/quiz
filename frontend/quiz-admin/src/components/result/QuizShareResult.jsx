// src/components/ShareResultBox.jsx
import React from "react";

export default function ShareResultBox({ shareUrl }) {
  if (!shareUrl) return null;

  return (
    <div className="mt-6 border rounded-xl p-4
     bg-green-50 dark:bg-green-900 border-green-500
      flex flex-col gap-2"
    >
      <b className="text-green-700 dark:text-green-300">Share your result:</b>
      <input
        type="text"
        value={shareUrl}
        readOnly
        className="w-full px-2 py-1 rounded border
          bg-neutral-100 dark:bg-neutral-900 p-4 shadow-sm 
          border-neutral-200 dark:border-neutral-700
          transition-colors  dark:text-neutral-100"
        onFocus={e => e.target.select()}
      />

      <button
        className="self-start px-4 py-1 rounded-lg font-semibold
          bg-blue-600 text-white hover:bg-blue-700
          dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        onClick={() => navigator.clipboard.writeText(shareUrl)}
      >
        Copy Link
      </button>
    </div>
  );
}
