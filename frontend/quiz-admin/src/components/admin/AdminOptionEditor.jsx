import React from "react";
import { FaTrash } from "react-icons/fa";

function OptionEditor({ value, onChange, isCorrect, onCorrect, canRemove, onRemove }) {

  return (
    <div className={`quiz-option ${isCorrect ? "quiz-option-correct" : ""}`}>
      <textarea
        className={`quiz-textarea min-h-[100px] flex-1 ${
          isCorrect ? "quiz-textarea-correct" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <input
        type="radio"
        checked={isCorrect}
        onChange={onCorrect}
        className="quiz-radio-input mt-3"
        title="Mark as correct"
      />
      {canRemove && (
        <button
          type="button"
          className="quiz-icon-btn quiz-icon-btn-danger"
          onClick={onRemove}
          aria-label="Remove option"
          title="Remove option"
        >
          <FaTrash size={14} />
        </button>
      )}
    </div>
  );
}

export default OptionEditor;
