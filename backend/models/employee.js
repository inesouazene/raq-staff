// models/employee.js

const db = require('./database');

class Employee {
  static async getAll() {
    const { rows } = await db.query('SELECT * FROM salarie');
    return rows;
  };
	static async getById(id) {
		const { rows } = await db.query('SELECT * FROM salarie WHERE id = $1', [id]);
		return rows[0];
	};
	static async create(employeeData) {
    const { nom, prenom, date_naissance, email, telephone, heures_contrat, type_contrat } = employeeData;
    const query = `
      INSERT INTO salarie (nom, prenom, date_naissance, email, telephone, heures_contrat, type_contrat)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [nom, prenom, date_naissance, email, telephone, heures_contrat, type_contrat];
    const { rows } = await db.query(query, values);
    return rows[0];
  };
	static async update(id, employeeData) {
    const { nom, prenom, date_naissance, telephone, email, heures_contrat, type_contrat } = employeeData;
    const query = `
      UPDATE salarie
      SET nom = $1, prenom = $2, date_naissance = $3, telephone = $4, email = $5, heures_contrat = $6, type_contrat = $7
      WHERE id = $8
      RETURNING *
    `;
    const values = [nom, prenom, date_naissance, telephone, email, heures_contrat, type_contrat, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  };
	static async delete(id) {
    const query = 'DELETE FROM salarie WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0];
  };
}

module.exports = Employee;
