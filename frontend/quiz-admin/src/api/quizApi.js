import axios from "axios";

export async function fetchQuizzes() {
  const res = await axios.get("/api/quizzes");
  return res.data;
}

export async function createQuiz(quiz) {
  return axios.post("/api/quizzes", quiz);
}
export async function updateQuiz(id, quiz) {
  return axios.put(`/api/quizzes/${id}`, quiz);
}
export async function deleteQuiz(id) {
  return axios.delete(`/api/quizzes/${id}`);
}

export async function submitQuizResult(result) {
  try {
    // result = { quizJson, userAnswersJson, score, totalQuestions, correctAnswersJson }
    const res = await axios.post("/api/quiz-results", result);
    return res.data; // backend should return the saved result (including shareCode)
  } catch (e) {
    const status = e?.response?.status ?? e?.status ?? null;
    const message = e?.response?.data?.message ?? e?.data?.message ?? e.message ?? "Unknown error";
    const code = !status ? "NETWORK" : `HTTP_${status}`;
    throw new ApiError({ status, code, message });
  }
}

export class ApiError extends Error {
  constructor({ status, code, message }) {
    super(message); this.status = status; this.code = code;
  }
}