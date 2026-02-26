const request = require("supertest");
const app = require("../app");
const email = `test${Date.now()}@example.com`;

describe("Auth API", () => {
  let token;

  it("should register user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email,
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
  });

  it("should login user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    token = res.body.accessToken;
  });

  it("should reject unauthorized request", async () => {
    const res = await request(app).get("/todos");

    expect(res.statusCode).toBe(401);
  });
});
