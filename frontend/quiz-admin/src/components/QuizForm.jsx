import React from "react";
import QuestionEditor from "./QuestionEditor";

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
        <form onSubmit={e => { e.preventDefault(); onSubmit(quiz); }} className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl p-8 mt-4">
            <h2 className="text-2xl dark:text-neutral-100 font-bold mb-6">{quiz.id ? "Edit Quiz" : "Create New Quiz"}</h2>

            <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl shadow flex flex-col gap-3 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold">Title</span>
                </div>
                <input
                    type="text"
                    name="title"
                    className="border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 font-mono w-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                    value={quiz.title}
                    onChange={handleQuizChange}
                    required
                    placeholder="Quiz title"
                />
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 font-semibold">Description</div>
                <textarea
                    name="description"
                    className="border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 font-mono min-h-[140px] w-full resize-y bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                    value={quiz.description}
                    onChange={handleQuizChange}
                    placeholder="Describe this quiz (optional)"
                />
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-neutral-700 dark:text-neutral-100">Questions</span>
                    <button type="button" className="text-blue-700 dark:text-blue-400 hover:underline font-semibold" onClick={handleAddQuestion}>+ Add Question</button>
                </div>
                <div className="space-y-4">
                    {quiz.questions.map((q, i) => (
                        <QuestionEditor key={i} number={i + 1} question={q} setQuestion={updatedQ => handleQuestionUpdate(i, updatedQ)} onRemove={() => handleRemoveQuestion(i)} />
                    ))}
                </div>
            </div>
            <div className="mt-8 flex gap-3 justify-end">
                <button type="submit" className="bg-green-600 dark:bg-green-700 hover:bg-green-700 text-white dark:text-neutral-100 font-semibold px-6 py-2 rounded-xl shadow transition">Save</button>
                <button type="button" className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white dark:text-neutral-100 font-semibold px-6 py-2 rounded-xl shadow transition" onClick={handleAddQuestion}>+ Add Question</button>
                <button type="button" className="bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-400 text-neutral-700 dark:text-neutral-100 font-semibold px-6 py-2 rounded-xl" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}

export default QuizForm;