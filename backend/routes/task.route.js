import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  completeTask,
  incrementTaskPomodoro,
} from "../controllers/task.controller.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Task routes
router.get("/", getTasks);
router.post("/", createTask);
router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.patch("/:taskId/complete", completeTask);
router.patch("/:taskId/increment-pomodoro", incrementTaskPomodoro);

export default router; 