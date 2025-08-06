// src/components/WarningMessage.jsx
import React, { forwardRef } from "react";

const WarningMessage = forwardRef(function WarningMessage({ message = "Please select an answer!" }, ref) {
  return (
    <div
      ref={ref}
      className="shake flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2 rounded-xl font-bold text-base shadow mt-2"
      style={{ minHeight: "2.5rem" }}
    >
      {message}
    </div>
  );
});

export default WarningMessage;
