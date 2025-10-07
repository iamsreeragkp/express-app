const BaseModel = require("./BaseModel");
const pool = require("../database/connection");

class User extends BaseModel {
  constructor() {
    super("users");
  }

  async findByAuth0Id(auth0Id) {
    const query = "SELECT * FROM users WHERE auth0_id = $1";
    const result = await pool.query(query, [auth0Id]);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async createFromAuth0(auth0User) {
    const userData = {
      auth0_id: auth0User.sub,
      email: auth0User.email,
      first_name: auth0User.given_name || auth0User.name?.split(" ")[0],
      last_name:
        auth0User.family_name || auth0User.name?.split(" ").slice(1).join(" "),
      profile_picture: auth0User.picture,
    };

    return await this.create(userData);
  }

  async updateProfile(id, profileData) {
    const allowedFields = ["first_name", "last_name", "profile_picture"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (profileData[field] !== undefined) {
        updateData[field] = profileData[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields to update");
    }

    return await this.update(id, updateData);
  }

  async getActiveUsers(limit = 100, offset = 0) {
    return await this.findAll({ is_active: true }, limit, offset);
  }

  async deactivateUser(id) {
    return await this.update(id, { is_active: false });
  }

  async activateUser(id) {
    return await this.update(id, { is_active: true });
  }
}

module.exports = User;
