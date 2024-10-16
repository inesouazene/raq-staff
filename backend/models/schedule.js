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
			t.id_type_tache, t.description, tt.nom as nom_type_tache, tt.couleur
			FROM taches t
			JOIN type_tache tt ON t.id_type_tache = tt.id
			WHERE t.date_tache BETWEEN $1 AND $2`;
		const result = await db.query(query, [startOfWeek, endOfWeek]);
		return result.rows;
	},
	// Fonction pour ajouter une tâche
	addTask: async (taskData) => {
	const { date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, description } = taskData;
	const query = `
		INSERT INTO taches (date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, description)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
	const values = [date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, description];
	const result = await db.query(query, values);
	return result.rows[0];
	},
	// Fonction pour supprimer une tâche
	deleteTask: async (id) => {
		const query = 'DELETE FROM taches WHERE id = $1 RETURNING *';
		const result = await db.query(query, [id]);

		return result.rows[0];
	},
	// Fonction pour modifier une tâche
	updateTask: async (id, taskData) => {
		const { date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, description } = taskData;
		const query = `
		  UPDATE taches
		  SET date_tache = $1, heure_debut = $2, heure_fin = $3, id_salarie = $4, id_type_tache = $5, description = $6
		  WHERE id = $7
		  RETURNING *;`;

		const values = [date_tache, heure_debut, heure_fin, id_salarie, id_type_tache, description, id];
		const result = await db.query(query, values);

		return result.rows[0];  // Retourne la tâche modifiée ou undefined si aucune tâche mise à jour
	}
};


module.exports = scheduleModel;
