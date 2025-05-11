import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getUserSettings,
  updateUserSettings,
} from "../controllers/settings.controller.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Settings routes
router.get("/", getUserSettings);
router.patch("/", updateUserSettings);

export default router; 