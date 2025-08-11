import React from "react";
import QuestionEditor from "./AdminQuestionEditor";

const emptyQuestion = { text: "", options: ["", "", "", ""], correctOptionExplain: "", correctOptionIndex: 0 };

function QuizForm({ quiz, setQuiz, onSubmit, onCancel }) {
    const handleQuizChange = (e) => setQuiz({ ...quiz, [e.target.name]: e.target.value });
    const handleAddQuestion = () => setQuiz({ ...quiz, questions: [...quiz.questions, { ...emptyQuestion }] });
    const handleQuestionUpdate = (index, updatedQuestion) => {
        const newQuestions = [...quiz.questions];
        newQuestions[index] = updatedQuestion;
        setQuiz({ ...quiz, questions: newQuestions });
    };
    const handleRemoveQuestion = (index) => setQuiz({ ...quiz, questions: quiz.questions.filter((_, i) => i !== index) });

    return (
        <form onSubmit={e => { e.preventDefault(); onSubmit(quiz); }} className="shadow-xl rounded-2xl p-8 mt-4">
            <h2 className="text-2xl font-bold mb-6">{quiz.id ? "Edit Quiz" : "Create New Quiz"}</h2>

            <div className="quiz-box p-4 rounded-xl shadow flex flex-col gap-3 mb-6">
                <div className="quiz-flex">
                    <span className="quiz-muted">Title</span>
                </div>
                <input
                    type="text"
                    name="title"
                    className="quiz-input"
                    value={quiz.title}
                    onChange={handleQuizChange}
                    required
                    placeholder="Quiz title"
                />
                <div className="quiz-muted">Description</div>
                <textarea
                    name="description"
                    className="quiz-textarea"
                    value={quiz.description}
                    onChange={handleQuizChange}
                    placeholder="Describe this quiz (optional)"
                />
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-6">
                    <span className="quiz-muted">Questions</span>
                    <button type="button" className="text-blue-700 dark:text-blue-400 hover:underline font-semibold" onClick={handleAddQuestion}>+ Add Question</button>
                </div>
                <div className="space-y-4">
                    {quiz.questions.map((q, i) => (
                        <QuestionEditor key={i} number={i + 1} question={q} setQuestion={updatedQ => handleQuestionUpdate(i, updatedQ)} onRemove={() => handleRemoveQuestion(i)} />
                    ))}
                </div>
            </div>
            <div className="mt-8 flex gap-3 justify-end">
                <button type="submit" className="quiz-btn-success">Save</button>
                <button type="button" className="quiz-btn-primary" onClick={handleAddQuestion}>+ Add Question</button>
                <button type="button" className="quiz-btn-neutral" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}

export default QuizForm;