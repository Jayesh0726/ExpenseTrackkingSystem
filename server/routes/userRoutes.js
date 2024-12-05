import express from "express";
const {handleCreateUser, handleGetUser} = require('../controllers/user');
const router = express.Router();

// Create a new user.
router.post("/", handleCreateUser);

// Get all users.
router.get("/", handleGetUser);

export default router;
