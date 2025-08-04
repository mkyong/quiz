import OptionEditor from "./OptionEditor";

function QuestionEditor({ question, setQuestion, onRemove }) {
  const handleTextChange = (e) => setQuestion({ ...question, text: e.target.value });
  const handleOptionChange = (oi, value) => {
    const options = [...question.options];
    options[oi] = value;
    setQuestion({ ...question, options });
  };
  const handleAddOption = () => setQuestion({ ...question, options: [...question.options, ""] });
  const handleRemoveOption = (oi) => {
    if (question.options.length <= 2) return;
    let newCorrect = question.correctOptionIndex;
    if (oi < newCorrect) newCorrect--;
    if (newCorrect >= question.options.length - 1) newCorrect = 0;
    setQuestion({ ...question, options: question.options.filter((_, i) => i !== oi), correctOptionIndex: newCorrect });
  };
  const handleCorrectChange = (oi) => setQuestion({ ...question, correctOptionIndex: oi });

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl shadow flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold">Question</span>
        <button type="button" className="ml-3 px-2 py-1 text-xs text-red-600 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 rounded transition" onClick={onRemove}>Remove</button>
      </div>
      <textarea className="border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 font-mono min-h-[140px] w-full resize-y bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" value={question.text} onChange={handleTextChange} required />
      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 font-semibold">Options:</div>
      {question.options.map((opt, oi) => (
        <OptionEditor key={oi} value={opt} onChange={val => handleOptionChange(oi, val)} isCorrect={question.correctOptionIndex === oi} onCorrect={() => handleCorrectChange(oi)} canRemove={question.options.length > 2} onRemove={() => handleRemoveOption(oi)} />
      ))}
      <button type="button" className="text-blue-500 text-xs hover:underline mt-1" onClick={handleAddOption}>+ Add Option</button>
    </div>
  );
}

export default QuestionEditor;
