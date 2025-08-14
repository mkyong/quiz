// src/components/admin/AdminQuizForm.jsx
import React from "react";
import QuestionEditor from "./AdminQuestionEditor";

const emptyQuestion = {
  text: "",
  options: ["", "", "", ""],
  correctOptionExplain: "",
  correctOptionIndex: 0,
};

/**
 * AdminQuizForm – cleaner layout, improved light/dark contrasts.
 * - Uses neutral surfaces with subtle borders (quiz-box)
 * - Clear section headings, helper text
 * - Primary actions grouped in a sticky footer row
 */
function QuizForm({ quiz, setQuiz, onSubmit, onCancel }) {
  const handleQuizChange = (e) =>
    setQuiz({ ...quiz, [e.target.name]: e.target.value });

  const handleAddQuestion = () =>
    setQuiz({ ...quiz, questions: [...quiz.questions, { ...emptyQuestion }] });

  const handleQuestionUpdate = (index, updatedQuestion) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index] = updatedQuestion;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleRemoveQuestion = (index) =>
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index),
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(quiz);
      }}
      className="space-y-6"
    >
      {/* Header Card */}
      <section className="quiz-box p-6">
        <div className="quiz-flex mb-4">
          <h2 className="quiz-title">
            {quiz.id ? "Edit Quiz" : "Create New Quiz"}
          </h2>
          <span className="quiz-muted">
            {quiz.questions?.length ?? 0} question
            {(quiz.questions?.length ?? 0) === 1 ? "" : "s"}
          </span>
        </div>

        <label className="block mb-3">
          <div className="quiz-muted mb-2">Title</div>
          <input
            type="text"
            name="title"
            className="quiz-input mb-2"
            value={quiz.title}
            onChange={handleQuizChange}
            required
            placeholder="e.g. Java Basics (Beginner)"
            aria-label="Quiz title"
          />
        </label>

        <label className="block">
          <div className="quiz-muted mb-2">Description</div>
          <textarea
            name="description"
            className="quiz-input quiz-textarea mb-2"
            value={quiz.description}
            onChange={handleQuizChange}
            placeholder="Short summary shown to learners (optional)"
            aria-label="Quiz description"
          />
        </label>
      </section>

      {/* Questions Section */}
      <section className="mt-8">
        <div className="flex justify-end mb-8">
            <button
                type="button"
                className="quiz-btn-primary"
                onClick={handleAddQuestion}
            >
                + Add Question
            </button>
        </div>

        {quiz.questions.length === 0 ? (
          <div className="text-center py-10 quiz-muted">
            No questions yet. Use “Add Question”.
          </div>
        ) : (
          <div className="space-y-4">
            {quiz.questions.map((q, i) => (
              <QuestionEditor
                key={i}
                number={i + 1}
                question={q}
                setQuestion={(updatedQ) => handleQuestionUpdate(i, updatedQ)}
                onRemove={() => handleRemoveQuestion(i)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer actions */}
      <div className="sticky bottom-0 py-4 bg-gradient-to-t from-neutral-50/80 to-transparent dark:from-neutral-900/80 backdrop-blur rounded-b-xl">
        <div className="flex justify-end gap-2">
          <button type="button" className="quiz-btn-neutral" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="quiz-btn-primary" onClick={handleAddQuestion}>
            + Add Question
          </button>
          <button type="submit" className="quiz-btn-success">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default QuizForm;