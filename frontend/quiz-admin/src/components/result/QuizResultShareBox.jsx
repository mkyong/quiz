import React, { useState } from "react";
import { FaFacebook, FaXTwitter, FaLinkedin, FaWhatsapp, FaCopy, FaCheck, FaRotateLeft } from "react-icons/fa6";

const shareText = encodeURIComponent("Check out my quiz result!");

function getShareLinks(shareUrl) {
  return [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: <FaFacebook className="w-5 h-5" />,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`,
      icon: <FaXTwitter className="w-5 h-5" />,
      color: "bg-blue-400 hover:bg-blue-500 text-white",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shareUrl)}&title=${shareText}`,
      icon: <FaLinkedin className="w-5 h-5" />,
      color: "bg-blue-800 hover:bg-blue-900 text-white",
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent("Check out my quiz result: " + shareUrl)}`,
      icon: <FaWhatsapp className="w-5 h-5" />,
      color: "bg-emerald-500 hover:bg-emerald-600 text-white",
    },
  ];
}

/**
 * New props:
 * - loading: boolean (show skeleton while generating share link)
 * - error: string (optional error from saving)
 * - onRetry: function (retry handler if saving failed)
 */
export default function QuizShareResult({ shareUrl, loading = false, error = "", onRetry }) {
  
  const [copied, setCopied] = useState(false);

  // 1) While generating link: skeleton (works for slow/hanging server)
  if (loading) {
    return (
      <div className="quiz-box">
        <div className="font-bold mb-2">Share your result</div>
        <div className="animate-pulse">
          <div className="h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 mb-4" />
          <div className="flex gap-2">
            <div className="h-9 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-9 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-9 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
        </div>
      </div>
    );
  }

  // 2) If no link yet AND not loading → show error/empty state + Retry (stays visible even when backend is DOWN)
  if (!shareUrl) {
    return (
      <div className="quiz-box">
        <div className="font-bold mb-2">Share your result</div>
        <div className={`text-sm ${error ? "text-red-600 dark:text-red-300" : "text-neutral-600 dark:text-neutral-300"}`}>
          {error || "Share link is not available yet."}
        </div>
        {onRetry && (
          <button
            className="mt-3 inline-flex items-center gap-2 quiz-btn-neutral"
            onClick={onRetry}
            title="Retry generating link"
          >
            <FaRotateLeft className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    );
  }
  
  // Nothing to show if no URL and not loading (e.g., sharing disabled)
  //if (!shareUrl) return null;

  const shareLinks = getShareLinks(shareUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="quiz-box relative">
      <div className="font-bold mb-2">Share your result</div>
      <input
        type="text"
        value={shareUrl}
        readOnly
        className="w-full rounded-xl px-3 py-2 mb-4 quiz-input font-mono transition"
        onFocus={e => e.target.select()}
      />

      <div className="flex gap-2 flex-wrap mb-4">
        {shareLinks.map(link => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            className={`flex items-center gap-2 rounded px-2 py-2 font-semibold transition shadow-sm ${link.color}`}
            title={`Share on ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
        <button
          className="
            flex items-center gap-2 rounded px-2 py-2 font-semibold transition
            bg-neutral-200 dark:bg-neutral-700 text-blue-700 dark:text-blue-200
            hover:bg-neutral-300 dark:hover:bg-neutral-600 shadow-sm cursor-pointer
          "
          title="Copy link"
          onClick={handleCopy}
        >
          <FaCopy className="w-5 h-5" />
        </button>
      </div>

      {/* Redesigned Toast (subtle blue, floating and clear) */}
      {copied && (
        <div
          className="
            absolute left-1/2 -translate-x-1/2 top-2
            bg-blue-600 dark:bg-blue-500 text-white
            border border-blue-700 dark:border-blue-400
            px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2
            animate-fade-in z-20
          "
          role="status"
          aria-live="polite"
        >
          <FaCheck className="w-4 h-4" />
          Link copied!
        </div>
      )}
    </div>
  );
}
