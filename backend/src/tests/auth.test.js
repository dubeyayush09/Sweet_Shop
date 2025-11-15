// src/tests/auth.test.js
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGO_URI;

beforeAll(async () => {
  if (!mongoUri) throw new Error("MONGO_URI not set in .env");
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Auth - Register & Login", () => {
  test("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Ayush",
        email: "ayush@example.com",
        password: "Password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "ayush@example.com");
    expect(res.body.user).not.toHaveProperty("password");
  });

  test("should not register duplicate email", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Ayush",
        email: "ayush@example.com",
        password: "Password123",
      });

    const res2 = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Ayush2",
        email: "ayush@example.com",
        password: "Another123",
      });

    expect(res2.statusCode).toBe(400);
    expect(res2.body).toHaveProperty("message");
  });

  test("should login a registered user", async () => {
    // register first
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Ayush",
        email: "ayush@example.com",
        password: "Password123",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ayush@example.com", password: "Password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "ayush@example.com");
  });

  test("login fails with wrong password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Ayush",
        email: "ayush@example.com",
        password: "Password123",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ayush@example.com", password: "WrongPass" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});
