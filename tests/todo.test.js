const request = require("supertest");
const app = require("../app");

let token;
let todoId;
const email = `todo${Date.now()}@test.com`;
describe("Todo API", () => {
  beforeAll(async () => {
    const res = await request(app).post("/api/auth/register").send({
      email,
      password: "password123",
    });
    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "password123",
    });

    token = login.body.accessToken;
  });

  it("should create todo", async () => {
    const res = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Todo",
        description: "Testing",
        status: "pending",
      });

    expect(res.statusCode).toBe(201);
    todoId = res.body.data._id;
  });
  it("should get todos", async () => {
    const res = await request(app)
      .get("/todos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
