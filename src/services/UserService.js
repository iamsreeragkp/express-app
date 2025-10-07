const User = require("../models/User");

class UserService {
  constructor() {
    this.userModel = new User();
  }

  async getUserById(id) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async getUserByAuth0Id(auth0Id) {
    try {
      const user = await this.userModel.findByAuth0Id(auth0Id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to get user by Auth0 ID: ${error.message}`);
    }
  }

  async getAllUsers(filters = {}, limit = 100, offset = 0) {
    try {
      const users = await this.userModel.findAll(filters, limit, offset);
      const totalCount = await this.userModel.count(filters);

      return {
        users,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + users.length < totalCount,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(userData.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const user = await this.userModel.create(userData);
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async createUserFromAuth0(auth0User) {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findByAuth0Id(auth0User.sub);
      if (existingUser) {
        return existingUser;
      }

      const user = await this.userModel.createFromAuth0(auth0User);
      return user;
    } catch (error) {
      throw new Error(`Failed to create user from Auth0: ${error.message}`);
    }
  }

  async updateUser(id, updateData) {
    try {
      const user = await this.userModel.updateProfile(id, updateData);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.userModel.delete(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async deactivateUser(id) {
    try {
      const user = await this.userModel.deactivateUser(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to deactivate user: ${error.message}`);
    }
  }

  async activateUser(id) {
    try {
      const user = await this.userModel.activateUser(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to activate user: ${error.message}`);
    }
  }

  async getActiveUsers(limit = 100, offset = 0) {
    try {
      const users = await this.userModel.getActiveUsers(limit, offset);
      const totalCount = await this.userModel.count({ is_active: true });

      return {
        users,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + users.length < totalCount,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get active users: ${error.message}`);
    }
  }
}

module.exports = UserService;
