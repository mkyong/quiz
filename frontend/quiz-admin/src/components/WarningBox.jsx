import React, { forwardRef } from "react";

const WarningBox = forwardRef(function WarningBox({ message = "Please select an answer!" }, ref) {
  return (
    <div
      ref={ref}
      className="shake quiz-warning-box px-4 py-2"
      style={{ minHeight: "2.5rem" }}
    >
      <div className="quiz-warning-tex">{message}</div>
    </div>
  );
});

export default WarningBox;
