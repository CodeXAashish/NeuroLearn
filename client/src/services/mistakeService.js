import axios from "axios";

const API_URL = "http://localhost:5000/api/mistakes";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMistakes = async () => {
  const response = await axios.get(
    API_URL,
    getAuthConfig()
  );

  return response.data;
};

export const resolveMistake = async (id) => {
  const response = await axios.put(
    `${API_URL}/${id}/resolve`,
    {},
    getAuthConfig()
  );

  return response.data;
};
export const explainMistake = async (mistake) => {
  const response = await axios.post(
    `${API_URL}/explain`,
    {
      question: mistake.question,
      userAnswer: mistake.userAnswer,
      correctAnswer: mistake.correctAnswer,
    },
    getAuthConfig()
  );

  return response.data;
};