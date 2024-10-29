// controllers/scheduleController.js

const scheduleModel = require('../models/schedule');
	// Méthode pour récupérer les salariés
	const scheduleController = {
		getAllEmployees: async (req, res) => {
			try {
				const employees = await scheduleModel.getAllEmployees();
				const formattedEmployees = employees.map(employee => ({
					id: employee.id,
					name: `${employee.prenom} ${employee.nom}`
				}));
				res.json(formattedEmployees);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
		},
		// Méthode pour récupérer les tâches des salariés par semaine
		getTasksByWeek: async (req, res) => {
			try {
				const { startOfWeek, endOfWeek } = req.query;
				const tasks = await scheduleModel.getTasksByWeek(startOfWeek, endOfWeek);
				res.json(tasks);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
		},

		// Méthode pour ajouter une tâche
		addTask: async (req, res) => {
			try {
			  const { date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, pause } = req.body;

			  // Si id_salarie n'est pas un tableau, retournez une erreur
			  if (!Array.isArray(id_salarie)) {
				return res.status(400).json({ error: 'Le champ id_salarie doit être un tableau.' });
			  }

			  // Crée un tableau de tâches pour chaque salarié sélectionné
			  const taskDataArray = id_salarie.map(salarieId => ({
				date_tache,
				heure_debut,
				heure_fin,
				id_salarie: salarieId,
				id_type_tache,
				pause
			  }));

			  // Appelle le modèle pour ajouter toutes les tâches en une seule fois
			  const tasks = await scheduleModel.addTask(taskDataArray);

			  res.status(201).json({ message: 'Tâches ajoutées avec succès!', tasks });
			} catch (error) {
			  res.status(500).json({ error: error.message });
			}
		},
		// Méthode pour supprimer une tâche
		deleteTask: async (req, res) => {
			try {
				const { id } = req.params;
				// Suppression de la tâche via le modèle
				const deletedTask = await scheduleModel.deleteTask(id);

				if (deletedTask) {
					res.status(200).json({ message: 'Tâche supprimée avec succès!', task: deletedTask });
				} else {
					res.status(404).json({ message: 'Tâche non trouvée' });
				}
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
		},
		// Méthode pour modifier une tâche
		updateTask: async (req, res) => {
			try {
				const { id } = req.params;
				const { date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, pause } = req.body;

				// Mise à jour de la tâche via le modèle
				const updatedTask = await scheduleModel.updateTask(id, {
					date_tache,
					heure_debut,
					heure_fin,
					id_salarie,
					id_type_tache,
					pause
				});

				if (updatedTask) {
					res.status(200).json({ message: 'Tâche mise à jour avec succès!', task: updatedTask });
				} else {
					res.status(404).json({ message: 'Tâche non trouvée' });
				}
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
		},
		getTaskTypes: async (req, res) => {
			try {
			  const taskTypes = await scheduleModel.getTaskTypes();
			  res.json(taskTypes);
			} catch (error) {
			  res.status(500).json({ error: error.message });
			}
		},
};

module.exports = scheduleController;
