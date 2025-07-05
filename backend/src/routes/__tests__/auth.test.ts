import request from "supertest";
import app from "../../app"; // Import your  Express-App

describe("Auth routes", () => {
  it("should return 400 if email or password is missing", async () => {
    const res = await request(app).post("/api/login").send({ email: "" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // ... Add more tests for login, registration, password reset, etc.
});