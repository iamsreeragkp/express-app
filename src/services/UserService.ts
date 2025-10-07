import UserModel from "../models/User";
import {
  Auth0User,
  CreateUserData,
  PaginatedResponse,
  UpdateUserData,
  User,
  UserFilters,
} from "../types";

class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async getUserByAuth0Id(auth0Id: string): Promise<User> {
    try {
      const user = await this.userModel.findByAuth0Id(auth0Id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: any) {
      throw new Error(`Failed to get user by Auth0 ID: ${error.message}`);
    }
  }

  async getAllUsers(
    filters: UserFilters = {},
    limit: number = 100,
    offset: number = 0
  ): Promise<PaginatedResponse<User>> {
    try {
      const users = await this.userModel.findAll(filters, limit, offset);
      const totalCount = await this.userModel.count(filters);

      return {
        data: users,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + users.length < totalCount,
        },
      };
    } catch (error: any) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(userData.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const user = await this.userModel.create(userData);
      return user;
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async createUserFromAuth0(auth0User: Auth0User): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findByAuth0Id(auth0User.sub);
      if (existingUser) {
        return existingUser;
      }

      const user = await this.userModel.createFromAuth0(auth0User);
      return user;
    } catch (error: any) {
      throw new Error(`Failed to create user from Auth0: ${error.message}`);
    }
  }

  async updateUser(id: string, updateData: UpdateUserData): Promise<User> {
    try {
      const user = await this.userModel.updateProfile(id, updateData);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const user = await this.userModel.delete(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async deactivateUser(id: string): Promise<User> {
    try {
      const user = await this.userModel.deactivateUser(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: any) {
      throw new Error(`Failed to deactivate user: ${error.message}`);
    }
  }

  async activateUser(id: string): Promise<User> {
    try {
      const user = await this.userModel.activateUser(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: any) {
      throw new Error(`Failed to activate user: ${error.message}`);
    }
  }

  async getActiveUsers(
    limit: number = 100,
    offset: number = 0
  ): Promise<PaginatedResponse<User>> {
    try {
      const users = await this.userModel.getActiveUsers(limit, offset);
      const totalCount = await this.userModel.count({ is_active: true });

      return {
        data: users,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + users.length < totalCount,
        },
      };
    } catch (error: any) {
      throw new Error(`Failed to get active users: ${error.message}`);
    }
  }
}

export default UserService;
