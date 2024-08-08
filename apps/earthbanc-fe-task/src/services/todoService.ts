import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export const fetchTasks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const fetchTaskById = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
