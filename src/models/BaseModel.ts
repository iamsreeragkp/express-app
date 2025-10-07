import pool from "../database/connection";

export default abstract class BaseModel {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async findById(id: string): Promise<any> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async findAll(
    filters: Record<string, any> = {},
    limit: number = 100,
    offset: number = 0
  ): Promise<any[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const values: any[] = [];
    let paramCount = 0;

    // Add WHERE conditions if filters exist
    const conditions: string[] = [];
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

  async create(data: Record<string, any>): Promise<any> {
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

  async update(id: string, data: Record<string, any>): Promise<any> {
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

  async delete(id: string): Promise<any> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async count(filters: Record<string, any> = {}): Promise<number> {
    let query = `SELECT COUNT(*) FROM ${this.tableName}`;
    const values: any[] = [];
    let paramCount = 0;

    const conditions: string[] = [];
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
