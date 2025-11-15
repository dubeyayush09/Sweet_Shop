import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";
import Sweet from "../models/Sweet.js";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

let adminToken = "";
let userToken = "";
let sweetId = "";

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  // Create admin
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@shop.com",
    password: "admin123",
  });

  await User.findOneAndUpdate({ email: "admin@shop.com" }, { role: "ADMIN" });

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@shop.com",
    password: "admin123",
  });

  adminToken = adminLogin.body.token;

  // Create user
  await request(app).post("/api/auth/register").send({
    name: "User",
    email: "user@shop.com",
    password: "user123",
  });

  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@shop.com",
    password: "user123",
  });

  userToken = userLogin.body.token;

  // Create a sweet
  const sweet = await Sweet.create({
    name: "Kaju Katli",
    category: "Indian",
    price: 50,
    quantity: 10,
  });

  sweetId = sweet._id.toString();
});

describe("Inventory Operations", () => {
  test("User can purchase a sweet (quantity decreases)", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.quantity).toBe(7); // 10 - 3
  });

  test("Cannot purchase if quantity is insufficient", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 20 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Not enough quantity in stock");
  });

  test("Admin can restock a sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.quantity).toBe(15); // 10 + 5
  });

  test("Normal user cannot restock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(403);
  });
});
