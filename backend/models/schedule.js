// models/schedule.js
const db = require('./database');
const { startOfWeek, endOfWeek, format } = require('date-fns');

const scheduleModel = {
  getWeekSchedule: async (date) => {
    const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(date), { weekStartsOn: 1 });

    const query = `
      SELECT ph.*, s.nom, s.prenom, p.nom AS position_nom, p.couleur AS position_couleur
      FROM plage_horaire ph
      JOIN salarie s ON ph.id_salarie = s.id
      JOIN position p ON ph.id_position = p.id
      WHERE ph.date BETWEEN $1 AND $2
    `;

    const result = await db.query(query, [format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd')]);
    return result.rows;
  },

  getEmployeeWeekSchedule: async (employeeId, date) => {
    const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(date), { weekStartsOn: 1 });

    const query = `
      SELECT ph.*, p.nom AS position_nom, p.couleur AS position_couleur
      FROM plage_horaire ph
      JOIN position p ON ph.id_position = p.id
      WHERE ph.id_salarie = $1 AND ph.date BETWEEN $2 AND $3
    `;

    const result = await db.query(query, [employeeId, format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd')]);
    return result.rows;
  },

  createTask: async (taskData) => {
    const { date, heure_debut, heure_fin, id_position, id_salarie, description } = taskData;
    const query = `
      INSERT INTO plage_horaire (date, heure_debut, heure_fin, id_position, id_salarie, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [date, heure_debut, heure_fin, id_position, id_salarie, description]);
    return result.rows[0];
  },

  updateTask: async (taskId, taskData) => {
    const { date, heure_debut, heure_fin, id_position, id_salarie, description } = taskData;
    const query = `
      UPDATE plage_horaire
      SET date = $1, heure_debut = $2, heure_fin = $3, id_position = $4, id_salarie = $5, description = $6
      WHERE id = $7
      RETURNING *
    `;
    const result = await db.query(query, [date, heure_debut, heure_fin, id_position, id_salarie, description, taskId]);
    return result.rows[0];
  },

  deleteTask: async (taskId) => {
    const query = 'DELETE FROM plage_horaire WHERE id = $1 RETURNING *';
    const result = await db.query(query, [taskId]);
    return result.rows[0];
  },

  getAllEmployees: async () => {
    const query = 'SELECT id, nom, prenom FROM salarie';
    const result = await db.query(query);
    return result.rows;
  }
};

module.exports = scheduleModel;
