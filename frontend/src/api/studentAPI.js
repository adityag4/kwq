import axios from "axios";

const API_URL = "http://localhost:5001/api/students";

// Fetch all students
export const getStudents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add a new student
export const addStudent = async (studentData) => {
  const response = await axios.post(API_URL, studentData);
  return response.data;
};

// Update a student by ID
export const updateStudent = async (id, studentData) => {
  const response = await axios.put(`${API_URL}/${id}`, studentData);
  return response.data;
};

// Delete a student by ID
export const deleteStudent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
