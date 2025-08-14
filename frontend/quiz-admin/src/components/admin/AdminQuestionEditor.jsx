import React from "react";
import OptionEditor from "./AdminOptionEditor";
import { FaTrash } from "react-icons/fa";
import ConfirmDialog from "../common/ConfirmDialog";
import { useConfirm } from "../common/useConfirm";

function QuestionEditor({ number, question, setQuestion, onRemove }) {
  const { state, confirm, close } = useConfirm();

  const handleTextChange = (e) =>
    setQuestion({ ...question, text: e.target.value });

  const handleExplainChange = (e) =>
    setQuestion({ ...question, correctOptionExplain: e.target.value });

  const handleOptionChange = (oi, value) => {
    const options = [...question.options];
    options[oi] = value;
    setQuestion({ ...question, options });
  };

  const handleAddOption = () =>
    setQuestion({ ...question, options: [...question.options, ""] });

  const handleRemoveOption = async (oi) => {
    // Keep at least 2 options
    if (question.options.length <= 2) return;

    const ok = await confirm({
      title: "Remove option?",
      message: "This option will be permanently removed from the question.",
      confirmText: "Remove",
      cancelText: "Cancel",
      danger: true,
    });
    if (!ok) return;

    // Adjust correct index after removal
    let newCorrect = question.correctOptionIndex;
    if (oi === newCorrect) {
      newCorrect = 0; // reset to first remaining option
    } else if (oi < newCorrect) {
      newCorrect = newCorrect - 1;
    }

    setQuestion({
      ...question,
      options: question.options.filter((_, i) => i !== oi),
      correctOptionIndex: newCorrect,
    });
  };

  const handleCorrectChange = (oi) =>
    setQuestion({ ...question, correctOptionIndex: oi });

  const confirmRemoveQuestion = async () => {
    const ok = await confirm({
      title: `Remove Question ${number}?`,
      message: "This action cannot be undone.",
      confirmText: "Remove",
      cancelText: "Cancel",
      danger: true,
    });
    if (ok) onRemove();
  };

  return (
    <>
      <div className="quiz-box">
        <div className="quiz-flex items-center">
          <span className="quiz-muted">Question {number}</span>
          <button
            type="button"
            className="quiz-icon-btn quiz-icon-btn-danger mb-4"
            onClick={confirmRemoveQuestion}
            aria-label="Remove question"
            title="Remove question"
          >
            <FaTrash size={16} />
          </button>
        </div>

        <textarea
          className="quiz-input quiz-textarea min-h-[200px] mb-4"
          value={question.text}
          onChange={handleTextChange}
          required
        />

        <div className="quiz-muted mb-2">Options</div>
        {question.options.map((opt, oi) => (
          <OptionEditor
            key={oi}
            value={opt}
            onChange={(val) => handleOptionChange(oi, val)}
            isCorrect={question.correctOptionIndex === oi}
            onCorrect={() => handleCorrectChange(oi)}
            canRemove={question.options.length > 2}
            onRemove={() => handleRemoveOption(oi)}
          />
        ))}

        <button
          type="button"
          className="quiz-btn-primary text-xs mb-8 mt-4"
          onClick={handleAddOption}
        >
          + Add Option
        </button>

        <div className="quiz-muted mb-2">Explanation</div>
        <textarea
          className="quiz-input quiz-textarea min-h-[140px]"
          value={question.correctOptionExplain}
          onChange={handleExplainChange}
          required
        />
      </div>

      {/* Modal (kept outside the card so it can portal to body) */}
      <ConfirmDialog state={state} onClose={close} />
    </>
  );
}

export default QuestionEditor;
