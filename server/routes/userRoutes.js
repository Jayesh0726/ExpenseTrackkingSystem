import express from "express";
import {handleCreateUser, handleGetUser} from '../controllers/user.js';
const router = express.Router();

// Create a new user.
router.post("/", handleCreateUser);

// Get all users.
router.get("/", handleGetUser);

export default router;
