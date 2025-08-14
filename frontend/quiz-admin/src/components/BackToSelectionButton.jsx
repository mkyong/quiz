import React from "react";
import { useConfirm } from "./common/useConfirm";
import ConfirmDialog from "./common/ConfirmDialog";

export default function BackToSelectionButton({ onBack }) {
  const { state, confirm, close } = useConfirm();

  const handleClick = async () => {
    const ok = await confirm({
      title: "Leave this quiz?",
      message: "Your current progress will be lost. Are you sure you want to go back to quiz selection?",
      confirmText: "Yes, Go Back",
      cancelText: "Stay Here",
      danger: false,
    });
    if (ok) {
      onBack();
    }
  };

  return (
    <>
      <button onClick={handleClick} className="quiz-btn-primary">
        &larr; Back To Quiz Selection
      </button>

      {/* Modal for confirmation */}
      <ConfirmDialog state={state} onClose={close} />
    </>
  );
}
