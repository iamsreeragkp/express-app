// Test setup file
import "dotenv/config";

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.DB_NAME = "generic_backend_test_db";
process.env.JWT_SECRET = "test-secret";

// Mock console.log to reduce noise during tests
const originalConsoleLog = console.log;
console.log = (...args: any[]) => {
  if (!args[0]?.includes?.("Connected to PostgreSQL database")) {
    originalConsoleLog(...args);
  }
};
