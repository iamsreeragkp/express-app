import pool from "../database/connection";
import { Auth0User, CreateUserData, UpdateUserData, User } from "../types";
import BaseModel from "./BaseModel";

class UserModel extends BaseModel {
  constructor() {
    super("users");
  }

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE auth0_id = $1";
    const result = await pool.query(query, [auth0Id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async createFromAuth0(auth0User: Auth0User): Promise<User> {
    const userData: CreateUserData = {
      auth0_id: auth0User.sub,
      email: auth0User.email,
      first_name: auth0User.given_name || auth0User.name?.split(" ")[0],
      last_name:
        auth0User.family_name || auth0User.name?.split(" ").slice(1).join(" "),
      profile_picture: auth0User.picture,
    };

    return await this.create(userData);
  }

  async updateProfile(id: string, profileData: UpdateUserData): Promise<User> {
    const allowedFields: (keyof UpdateUserData)[] = [
      "first_name",
      "last_name",
      "profile_picture",
    ];
    const updateData: Partial<UpdateUserData> = {};

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

  async getActiveUsers(
    limit: number = 100,
    offset: number = 0
  ): Promise<User[]> {
    return await this.findAll({ is_active: true }, limit, offset);
  }

  async deactivateUser(id: string): Promise<User> {
    return await this.update(id, { is_active: false });
  }

  async activateUser(id: string): Promise<User> {
    return await this.update(id, { is_active: true });
  }
}

export default UserModel;
