// models/schedule.js
const db = require('./database');

const scheduleModel = {
	// Fontion pour récupérer les salariés
	getAllEmployees: async () => {
    const query = 'SELECT id, nom, prenom FROM salarie';
    const result = await db.query(query);
    return result.rows;
  	},
	// Fonction pour récupérer les taches des salariés par semaine
	getTasksByWeek: async (startOfWeek, endOfWeek) => {
		const query = `
			SELECT t.id, t.date_tache, t.heure_debut, t.heure_fin, t.id_salarie,
			t.id_type_tache, t.pause, tt.nom as nom_type_tache, tt.couleur
			FROM taches t
			JOIN type_tache tt ON t.id_type_tache = tt.id
			WHERE t.date_tache BETWEEN $1 AND $2`;
		const result = await db.query(query, [startOfWeek, endOfWeek]);
		return result.rows;
	},
	// Fonction pour ajouter plusieurs tâches à la fois
	addTask: async (taskDataArray) => {
		// taskDataArray est un tableau contenant les données de chaque tâche
		const values = [];
		const placeholders = taskDataArray.map((taskData, i) => {
			const { date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, pause } = taskData;
			// Ajoute les valeurs dans le tableau en aplati
			values.push(date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, pause);
			// Crée les placeholders pour chaque ligne (6 colonnes)
			const index = i * 6; // car il y a 6 colonnes par ligne
			return `($${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, $${index + 5}, $${index + 6})`;
		}).join(", ");

		const query = `
			INSERT INTO taches (date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, pause)
			VALUES ${placeholders}
			RETURNING *`;

		const result = await db.query(query, values);
		return result.rows; // Renvoie toutes les tâches ajoutées
	},
	// Fonction pour supprimer une tâche
	deleteTask: async (id) => {
		const query = 'DELETE FROM taches WHERE id = $1 RETURNING *';
		const result = await db.query(query, [id]);

		return result.rows[0];
	},
	// Fonction pour modifier une tâche
	updateTask: async (id, taskData) => {
		const { date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, pause } = taskData;
		const query = `
		  UPDATE taches
		  SET date_tache = $1, heure_debut = $2, heure_fin = $3, id_salarie = $4, id_type_tache = $5, pause = $6
		  WHERE id = $7
		  RETURNING *;`;

		const values = [date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, pause, id];
		const result = await db.query(query, values);

		return result.rows[0];  // Retourne la tâche modifiée ou undefined si aucune tâche mise à jour
	},
	// Fonction pour récupérer les types de tâches
	getTaskTypes: async () => {
		const query = 'SELECT id, nom, couleur FROM type_tache';
		const result = await db.query(query);
		return result.rows; // Retourne tous les types de tâches
	},
};


module.exports = scheduleModel;
