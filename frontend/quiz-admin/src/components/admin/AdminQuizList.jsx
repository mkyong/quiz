import { useConfirm } from "../common/useConfirm";
import ConfirmDialog from "../common/ConfirmDialog";

function QuizList({ quizzes, onEdit, onDelete }) {
  const { state, confirm, close } = useConfirm();

  const handleDeleteClick = async (id, title) => {
    const ok = await confirm({
      title: `Delete ${title}?`,
      message: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      danger: true,
    });
    if (ok) onDelete(id);
  };

  return (
    <>
      <section className="space-y-4">
        {quizzes.length === 0 && (
          <div className="quiz-box p4">
            No quizzes found.
          </div>
        )}
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="quiz-box quiz-flex"
          >
            <div>
              <div className="quiz-title mb-4">{q.title}</div>
              <div className="quiz-description">{q.description}</div>
              <div className="quiz-muted">
                {q.questions?.length ?? 0} questions
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="quiz-btn-primary"
                onClick={() => onEdit(q)}
              >
                Edit
              </button>
              <button
                className="quiz-btn-danger"
                onClick={() => handleDeleteClick(q.id, q.title)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Confirmation dialog */}
      <ConfirmDialog state={state} onClose={close} />
    </>
  );
}

export default QuizList;