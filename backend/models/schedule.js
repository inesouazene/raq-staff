// models/schedule.js
const db = require('./database');

const scheduleModel = {
	getAllEmployees: async () => {
    const query = 'SELECT id, nom, prenom FROM salarie';
    const result = await db.query(query);
    return result.rows;
  	},
	getTasksByWeek: async (startOfWeek, endOfWeek) => {
		const query = `
			SELECT t.id, t.date_tache, t.heure_debut, t.heure_fin, t.id_salarie,
					t.id_type_tache, t.description, tt.nom as nom_type_tache, tt.couleur
			FROM taches t
			JOIN type_tache tt ON t.id_type_tache = tt.id
			WHERE t.date_tache BETWEEN $1 AND $2
		`;
		const result = await db.query(query, [startOfWeek, endOfWeek]);
		return result.rows;
	}
};


module.exports = scheduleModel;
