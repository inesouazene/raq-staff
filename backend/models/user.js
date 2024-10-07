// models/user.js

const db = require('./database');

class User {
  static async create({ id_salarie, username, password_hash, role }) {
    const query = `
      INSERT INTO utilisateurs (id_salarie, username, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, role
    `;
    const values = [id_salarie, username, password_hash, role];
    const { rows } = await db.query(query, values);
    return rows[0];
  }
	static async findById(id) {
    const query = 'SELECT * FROM utilisateurs WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
  static async updatePassword(id, password_hash) {
    const query = `
      UPDATE utilisateurs
      SET password_hash = $1
      WHERE id = $2
      RETURNING id
    `;
    const values = [password_hash, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }
	static async delete(id) {
    const query = 'DELETE FROM utilisateurs WHERE id = $1';
    await db.query(query, [id]);
  }
}

module.exports = User;
