function QuizList({ quizzes, onEdit, onDelete }) {
  return (
    <section className="space-y-4">
      {quizzes.length === 0 && <div className="text-neutral-400 dark:text-neutral-400 text-center">No quizzes found.</div>}
      {quizzes.map((q) => (
        <div key={q.id} className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-2xl shadow p-4 transition hover:shadow-lg">
          <div>
            <div className="font-bold text-lg text-neutral-900 dark:text-neutral-100">{q.title}</div>
            <div className="text-neutral-600 dark:text-neutral-400">{q.description}</div>
            <div className="text-xs text-neutral-400 dark:text-neutral-400 mt-1">{q.questions?.length ?? 0} questions</div>
          </div>
          <div className="flex gap-2">
            <button className="bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 rounded-lg px-3 py-1 text-sm" onClick={() => onEdit(q)}>Edit</button>
            <button className="bg-red-100 dark:bg-red-600 hover:bg-red-300 dark:hover:bg-red-500 text-red-600 dark:text-red-200 rounded-lg px-3 py-1 text-sm" onClick={() => onDelete(q.id)}>Delete</button>
          </div>
        </div>
      ))}
    </section>
  );
}
export default QuizList;
