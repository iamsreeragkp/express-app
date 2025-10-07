const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const UserService = require("../services/UserService");

const router = express.Router();
const userService = new UserService();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// GET /api/users - Get all users with pagination
router.get(
  "/",
  [
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("offset")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Offset must be a non-negative integer"),
    query("is_active")
      .optional()
      .isBoolean()
      .withMessage("is_active must be a boolean"),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { limit = 100, offset = 0, is_active } = req.query;
      const filters = {};

      if (is_active !== undefined) {
        filters.is_active = is_active === "true";
      }

      const result = await userService.getAllUsers(
        filters,
        parseInt(limit),
        parseInt(offset)
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/active - Get only active users
router.get(
  "/active",
  [
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("offset")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Offset must be a non-negative integer"),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const result = await userService.getActiveUsers(
        parseInt(limit),
        parseInt(offset)
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/me - Get current user profile
router.get("/me", async (req, res, next) => {
  try {
    const auth0Id = req.user.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - Get user by ID
router.get(
  "/:id",
  [
    param("id").isUUID().withMessage("Invalid user ID format"),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/users/me - Update current user profile
router.put(
  "/me",
  [
    body("first_name")
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage("First name must be between 1 and 100 characters"),
    body("last_name")
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage("Last name must be between 1 and 100 characters"),
    body("profile_picture")
      .optional()
      .isURL()
      .withMessage("Profile picture must be a valid URL"),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const auth0Id = req.user.sub;
      const user = await userService.getUserByAuth0Id(auth0Id);

      const updatedUser = await userService.updateUser(user.id, req.body);

      res.json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/users/:id - Update user by ID (admin only)
router.put(
  "/:id",
  [
    param("id").isUUID().withMessage("Invalid user ID format"),
    body("first_name")
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage("First name must be between 1 and 100 characters"),
    body("last_name")
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage("Last name must be between 1 and 100 characters"),
    body("profile_picture")
      .optional()
      .isURL()
      .withMessage("Profile picture must be a valid URL"),
    body("is_active")
      .optional()
      .isBoolean()
      .withMessage("is_active must be a boolean"),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);

      res.json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/users/:id - Delete user by ID (admin only)
router.delete(
  "/:id",
  [
    param("id").isUUID().withMessage("Invalid user ID format"),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const deletedUser = await userService.deleteUser(req.params.id);

      res.json({
        success: true,
        data: deletedUser,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/users/:id/deactivate - Deactivate user
router.patch(
  "/:id/deactivate",
  [
    param("id").isUUID().withMessage("Invalid user ID format"),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const user = await userService.deactivateUser(req.params.id);

      res.json({
        success: true,
        data: user,
        message: "User deactivated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/users/:id/activate - Activate user
router.patch(
  "/:id/activate",
  [
    param("id").isUUID().withMessage("Invalid user ID format"),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const user = await userService.activateUser(req.params.id);

      res.json({
        success: true,
        data: user,
        message: "User activated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
