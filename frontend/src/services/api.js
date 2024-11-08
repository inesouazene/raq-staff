// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5001'; // Ajustez l'URL si nécessaire

const api = {
	// Récupérer tous les salariés et leurs informations
	getAllEmployeesInfo: async () => {
		try {
			const response = await axios.get(`${API_URL}/employees`);
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la récupération des salariés : ", error);
			throw error;
		}
	},

  // Récupérer la liste de tous les salariés
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${API_URL}/schedules/employees`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des employés : ", error);
      throw error;
    }
  },

  // Récupérer les tâches d'une semaine spécifique
  getTasksByWeek: async (startOfWeek, endOfWeek) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/tasks/week`, {
        params: {
          startOfWeek,
          endOfWeek
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches : ", error);
      throw error;
    }
  },

  // Ajouter une nouvelle tâche
  addTask: async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/schedules/tasks/add`, taskData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout ou de la copie de la plage horaire : ", error);
      throw error;
    }
  },

	// Récupérer les données d'une tâche par son id
	getTaskById: async (taskId) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la tâche : ", error);
      throw error;
    }
  },

	// Mettre à jour une tâche
	updateTask: async (taskId, taskData) => {
		try {
			const response = await axios.put(`${API_URL}/schedules/tasks/${taskId}`, taskData);
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la mise à jour de la plage horaire : ", error);
			throw error;
		}
	},

  // Récupérer les types de tâche
  getTaskTypes: async () => {
    try {
      const response = await axios.get(`${API_URL}/schedules/task-types`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des types de tâche : ", error);
      throw error;
    }
  },

	// Supprimer une tâche
	deleteTask: async (taskId) => {
    try {
      await axios.delete(`${API_URL}/schedules/tasks/${taskId}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche", error);
      throw error;
    }
  },
	// Dupliquer des tâches d'une semaine vers une ou plusieurs autres semaines
  duplicateTasks: async ({ sourceWeek, destinationWeeks }) => {
    try {
      const response = await axios.post(`${API_URL}/schedules/tasks/duplicate`, {
        sourceWeek,
        destinationWeeks,  // Utilisation correcte du paramètre `destinationWeeks`
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la duplication des tâches : ", error);
      throw error;
    }
  },


}
export default api;
