const { connectDB, closeDB } = require("../config/db");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});
