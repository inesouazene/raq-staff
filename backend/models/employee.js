// models/employee.js

const db = require('./database');

class Employee {
  static async getAll() {
    try {
      const query = 'SELECT * FROM salarie ORDER BY prenom';
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = 'SELECT * FROM salarie WHERE id = $1';
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  static async getAllWithFormattedTimeSlots(startDate, endDate) {
    const query = `
      SELECT
        s.id, s.nom, s.prenom, s.type_contrat,
        json_agg(
          CASE WHEN ph.id IS NOT NULL THEN
            json_build_object(
              'id', ph.id,
              'start', concat(ph.date, ' ', ph.heure_debut),
              'end', concat(ph.date, ' ', ph.heure_fin),
              'resourceId', s.id,
              'title', p.nom,
              'bgColor', p.couleur,
              'description', ph.description
            )
          ELSE NULL END
        ) FILTER (WHERE ph.id IS NOT NULL) AS events
      FROM salarie s
      LEFT JOIN plage_horaire ph ON s.id = ph.id_salarie AND ph.date BETWEEN $1 AND $2
      LEFT JOIN position p ON ph.id_position = p.id
      GROUP BY s.id
      ORDER BY s.nom, s.prenom
    `;

    try {
      const { rows } = await db.query(query, [startDate, endDate]);
      return rows.map(row => ({
        id: row.id,
        name: `${row.prenom} ${row.nom}`,
        type_contrat: row.type_contrat,
        events: row.events || []
      }));
    } catch (error) {
      console.error('Error in getAllWithFormattedTimeSlots:', error);
      throw error;
    }
  }

  // Ajoutez d'autres méthodes si nécessaire
}

module.exports = Employee;
