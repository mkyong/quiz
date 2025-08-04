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
