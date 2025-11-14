import express from "express";
import {
  createSweet,
  getAllSweets,
  updateSweet,
  deleteSweet,
} from "../controllers/sweetController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllSweets);

// Admin only
router.post("/", authMiddleware, adminMiddleware, createSweet);
router.put("/:id", authMiddleware, adminMiddleware, updateSweet);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSweet);

export default router;
