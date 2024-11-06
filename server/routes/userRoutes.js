import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// Create a new user.
router.post("/", async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    console.log("Error creating User: ", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all users.
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log("Error fetching User: ", error.message);
    res.status(400).json({ success: false, message: "Server Error" });
  }
});

export default router;
