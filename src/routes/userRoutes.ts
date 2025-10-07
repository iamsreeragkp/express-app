import express, { NextFunction, Request, Response } from "express";
import { body, param, query, validationResult } from "express-validator";
import UserService from "../services/UserService";
import { ApiResponse, AuthenticatedRequest } from "../types";

const router = express.Router();
const userService = new UserService();

// Validation middleware
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    });
    return;
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = 100, offset = 0, is_active } = req.query;
      const filters: any = {};

      if (is_active !== undefined) {
        filters.is_active = is_active === "true";
      }

      const result = await userService.getAllUsers(
        filters,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      const response: ApiResponse = {
        success: true,
        data: result,
      };
      res.json(response);
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const result = await userService.getActiveUsers(
        parseInt(limit as string),
        parseInt(offset as string)
      );

      const response: ApiResponse = {
        success: true,
        data: result,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/me - Get current user profile
router.get(
  "/me",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const auth0Id = req.user.sub;
      const user = await userService.getUserByAuth0Id(auth0Id);

      const response: ApiResponse = {
        success: true,
        data: user,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/:id - Get user by ID
router.get(
  "/:id",
  [
    param("id").isUUID().withMessage("Invalid user ID format"),
    handleValidationErrors,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getUserById(req.params.id);

      const response: ApiResponse = {
        success: true,
        data: user,
      };
      res.json(response);
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
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const auth0Id = req.user.sub;
      const user = await userService.getUserByAuth0Id(auth0Id);

      const updatedUser = await userService.updateUser(user.id, req.body);

      const response: ApiResponse = {
        success: true,
        data: updatedUser,
      };
      res.json(response);
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);

      const response: ApiResponse = {
        success: true,
        data: updatedUser,
      };
      res.json(response);
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedUser = await userService.deleteUser(req.params.id);

      const response: ApiResponse = {
        success: true,
        data: deletedUser,
        message: "User deleted successfully",
      };
      res.json(response);
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.deactivateUser(req.params.id);

      const response: ApiResponse = {
        success: true,
        data: user,
        message: "User deactivated successfully",
      };
      res.json(response);
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.activateUser(req.params.id);

      const response: ApiResponse = {
        success: true,
        data: user,
        message: "User activated successfully",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
