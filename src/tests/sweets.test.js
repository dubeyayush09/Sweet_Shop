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

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  // Create admin
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@sweet.com",
    password: "Pass123",
  });

  await User.findOneAndUpdate({ email: "admin@sweet.com" }, { role: "ADMIN" });

  const loginAdmin = await request(app).post("/api/auth/login").send({
    email: "admin@sweet.com",
    password: "Pass123",
  });

  adminToken = loginAdmin.body.token;

  // Normal user
  await request(app).post("/api/auth/register").send({
    name: "User",
    email: "user@sweet.com",
    password: "Pass123",
  });

  const loginUser = await request(app).post("/api/auth/login").send({
    email: "user@sweet.com",
    password: "Pass123",
  });

  userToken = loginUser.body.token;
});

describe("Sweets CRUD", () => {
  test("Admin can create a new sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 20,
        quantity: 50,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe("Gulab Jamun");
  });

  test("Normal user cannot create sweets", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Ladoo",
        category: "Indian",
        price: 10,
        quantity: 30,
      });

    expect(res.statusCode).toBe(403);
  });

  test("Get all sweets", async () => {
    await Sweet.create({
      name: "Barfi",
      category: "Indian",
      price: 30,
      quantity: 20,
    });

    const res = await request(app).get("/api/sweets");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  test("Update sweet (admin only)", async () => {
    const sweet = await Sweet.create({
      name: "Rasgulla",
      category: "Indian",
      price: 25,
      quantity: 40,
    });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 35 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(35);
  });

  test("Delete sweet (admin only)", async () => {
    const sweet = await Sweet.create({
      name: "Jalebi",
      category: "Indian",
      price: 12,
      quantity: 60,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});
