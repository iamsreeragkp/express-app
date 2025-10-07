import { NextFunction, Request, Response } from "express";

interface ErrorWithCode extends Error {
  code?: string;
  status?: number;
  name?: string;
  errors?: any;
}

const errorHandler = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  // Default error
  let error = {
    message: err.message || "Internal Server Error",
    status: err.status || 500,
  };

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors || {})
      .map((val: any) => val.message)
      .join(", ");
    error = {
      message,
      status: 400,
    };
  }

  // JWT errors
  if (err.name === "UnauthorizedError") {
    error = {
      message: "Invalid token or token expired",
      status: 401,
    };
  }

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case "23505": // Unique violation
        error = {
          message: "Resource already exists",
          status: 409,
        };
        break;
      case "23503": // Foreign key violation
        error = {
          message: "Referenced resource does not exist",
          status: 400,
        };
        break;
      case "23502": // Not null violation
        error = {
          message: "Required field is missing",
          status: 400,
        };
        break;
      default:
        error = {
          message: "Database error",
          status: 500,
        };
    }
  }

  res.status(error.status).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
