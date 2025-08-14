
// -------------------------------------------------------------
// src/components/admin/AdminOptionEditor.jsx (icon-based correct marker)
// -------------------------------------------------------------
import React from "react";
import { CheckCircle, Circle, Trash2 } from "lucide-react";

/**
 * OptionEditor – replaces radio with an icon toggle for the accepted answer.
 * - Click the check icon to mark as correct
 * - Visual state uses existing quiz-option / quiz-option-correct styles
 */
export function OptionEditor({
  value,
  onChange,
  isCorrect,
  onCorrect,
  canRemove,
  onRemove,
}) {
  return (
    <div className={`quiz-option-no-hover ${isCorrect ? "quiz-option-correct" : ""}`}>
      <textarea
        className={`quiz-textarea min-h-[100px] flex-1 ${
          isCorrect ? "quiz-textarea-correct" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-label="Option text"
      />

      {/* Icon toggle for correct */}
      <button
        type="button"
        className="quiz-icon-btn"
        onClick={onCorrect}
        title={isCorrect ? "Accepted answer" : "Mark as accepted"}
        aria-pressed={isCorrect}
      >
        {isCorrect ? <CheckCircle size={18} /> : <Circle size={18} />}
      </button>

      {canRemove && (
        <button
          type="button"
          className="quiz-icon-btn quiz-icon-btn-danger"
          onClick={onRemove}
          aria-label="Remove option"
          title="Remove option"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

export default OptionEditor;