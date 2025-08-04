import React from "react";
function OptionEditor({ value, onChange, isCorrect, onCorrect, canRemove, onRemove }) {
  return (
    <div className="flex items-start gap-2">
      <textarea className="border border-neutral-300 dark:border-neutral-700 rounded-lg px-2 py-1 font-mono min-h-[60px] w-full resize-y bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" value={value} onChange={e => onChange(e.target.value)} required />
      <input type="radio" checked={isCorrect} onChange={onCorrect} className="accent-blue-600 dark:accent-blue-400 mt-3" title="Correct answer" />
      {canRemove && <button type="button" className="px-2 py-0 text-xs text-red-600 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 rounded self-start mt-3 transition" onClick={onRemove}>Remove</button>}
    </div>
  );
}
export default OptionEditor;
