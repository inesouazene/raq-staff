import axios from 'axios';

const API_URL = 'http://localhost:5001'; // Ajustez l'URL si nécessaire

const api = {
  // Récupérer le planning de la semaine pour tous les employés
  getWeekSchedule: async (date) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/week/${date}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du planning de la semaine : ", error);
      throw error;
    }
  },

  // Récupérer le planning de la semaine pour un employé spécifique
  getEmployeeWeekSchedule: async (employeeId, date) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/employee/${employeeId}/week/${date}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du planning de l'employé ${employeeId} pour la semaine du ${date} : `, error);
      throw error;
    }
  },

  // Créer une nouvelle tâche dans le planning
  createTask: async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/schedules/task`, taskData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la tâche : ", error);
      throw error;
    }
  },

  // Mettre à jour une tâche existante dans le planning
  updateTask: async (taskId, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/schedules/task/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la tâche ${taskId} : `, error);
      throw error;
    }
  },

  // Supprimer une tâche du planning
  deleteTask: async (taskId) => {
    try {
      const response = await axios.delete(`${API_URL}/schedules/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la tâche ${taskId} : `, error);
      throw error;
    }
  },

  // Récupérer la liste de tous les employés
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${API_URL}/schedules/employees`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des employés : ", error);
      throw error;
    }
  }
};

export default api;
