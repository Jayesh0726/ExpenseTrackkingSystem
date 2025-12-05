import express from "express";
import {
  handleCreateUser,
  handleLoginUser,
  handleLogoutUser,
  handleVerifySession,
  handleGetUser,
} from '../controllers/user.js';

const router = express.Router();

// Create a new user (Sign up)
router.post("/signup", handleCreateUser);

// User login
router.post("/login", handleLoginUser);

// User logout
router.post("/logout", handleLogoutUser);

// Verify session
router.post("/verify-session", handleVerifySession);

// Get all users
router.get("/", handleGetUser);

export default router;
