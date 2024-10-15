import axios from 'axios';

const API_URL = 'http://localhost:5001'; // Ajustez l'URL si nécessaire

const api = {
  // Récupérer la liste de tous les employés
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
	}
};

export default api;
