import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import Sweet from "../models/Sweet.js";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Sweet.deleteMany({});

  await Sweet.insertMany([
    { name: "Gulab Jamun", category: "Indian", price: 20, quantity: 50 },
    { name: "Rasgulla", category: "Bengali", price: 25, quantity: 40 },
    { name: "Barfi", category: "Milk", price: 30, quantity: 60 },
    { name: "Kaju Katli", category: "Dry Fruit", price: 50, quantity: 30 },
  ]);
});

describe("Sweet Search API", () => {
  test("Search by name (partial match)", async () => {
    const res = await request(app).get("/api/sweets/search?name=gal");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe("Gulab Jamun");
  });

  test("Search by category", async () => {
    const res = await request(app).get("/api/sweets/search?category=Bengali");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe("Rasgulla");
  });

  test("Search by price range", async () => {
    const res = await request(app).get(
      "/api/sweets/search?minPrice=20&maxPrice=30"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(3); // Barfi, Rasgulla, Gulab Jamun
  });

  test("Search returns empty array when nothing matches", async () => {
    const res = await request(app).get("/api/sweets/search?name=xyz");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});
