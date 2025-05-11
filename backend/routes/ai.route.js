import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { generateTaskSuggestions, breakdownTask } from "../controllers/ai.controller.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// AI feature routes
router.post("/suggest-tasks", generateTaskSuggestions);
router.post("/breakdown-task", breakdownTask);

export default router; 