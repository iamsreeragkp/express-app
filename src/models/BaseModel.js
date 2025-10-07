const pool = require("../database/connection");

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async findAll(filters = {}, limit = 100, offset = 0) {
    let query = `SELECT * FROM ${this.tableName}`;
    const values = [];
    let paramCount = 0;

    // Add WHERE conditions if filters exist
    const conditions = [];
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        paramCount++;
        conditions.push(`${key} = $${paramCount}`);
        values.push(filters[key]);
      }
    });

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add pagination
    paramCount++;
    query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    values.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    values.push(offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  async create(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length + 1}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }

  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async count(filters = {}) {
    let query = `SELECT COUNT(*) FROM ${this.tableName}`;
    const values = [];
    let paramCount = 0;

    const conditions = [];
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        paramCount++;
        conditions.push(`${key} = $${paramCount}`);
        values.push(filters[key]);
      }
    });

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }
}

module.exports = BaseModel;
