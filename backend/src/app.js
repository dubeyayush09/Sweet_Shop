// src/app.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import sweetRoutes from "./routes/sweetRoutes.js"; // placeholder, create later

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes); // will 404 until sweetRoutes created

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

export default app;
