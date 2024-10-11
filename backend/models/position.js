// models/position.js

const db = require('./database');

class Position {
  static async getAll() {
    const query = 'SELECT * FROM position';
    const { rows } = await db.query(query);
    return rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM position WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async create({ nom, couleur }) {
    const query = `
      INSERT INTO position (nom, couleur)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [nom, couleur];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async update(id, { nom, couleur }) {
    const query = `
      UPDATE position
      SET nom = $1, couleur = $2
      WHERE id = $3
      RETURNING *
    `;
    const values = [nom, couleur, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM position WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Position;
