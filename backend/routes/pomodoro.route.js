import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  startSession,
  endSession,
  getUserSessions,
  getSessionStats,
} from "../controllers/pomodoro.controller.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Pomodoro session routes
router.post("/start", startSession);
router.post("/end", endSession);
router.get("/sessions", getUserSessions);
router.get("/stats", getSessionStats);

export default router; 