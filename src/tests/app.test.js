const request = require("supertest");
const app = require("../app");

describe("Health Check", () => {
  test("GET /health should return 200", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body.status).toBe("OK");
    expect(response.body.timestamp).toBeDefined();
    expect(response.body.uptime).toBeDefined();
  });
});

describe("User Routes", () => {
  test("GET /api/users without auth should return 401", async () => {
    await request(app).get("/api/users").expect(401);
  });

  test("GET /api/users/me without auth should return 401", async () => {
    await request(app).get("/api/users/me").expect(401);
  });
});

describe("404 Handler", () => {
  test("GET /nonexistent should return 404", async () => {
    const response = await request(app).get("/nonexistent").expect(404);

    expect(response.body.error).toBe("Route not found");
  });
});
