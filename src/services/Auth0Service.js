const { ManagementClient } = require("auth0");

const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: "read:users update:users",
});

const auth0Service = {
  async getUserInfo(userId) {
    try {
      const user = await management.getUser({ id: userId });
      return user;
    } catch (error) {
      throw new Error(`Failed to get user info from Auth0: ${error.message}`);
    }
  },

  async updateUserInfo(userId, userData) {
    try {
      const user = await management.updateUser({ id: userId }, userData);
      return user;
    } catch (error) {
      throw new Error(`Failed to update user info in Auth0: ${error.message}`);
    }
  },

  async deleteUser(userId) {
    try {
      await management.deleteUser({ id: userId });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user from Auth0: ${error.message}`);
    }
  },
};

module.exports = auth0Service;
