import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import redis from "../config/redis.js";

// Function for create user (Sign up)
async function handleCreateUser(req, res){
    const { email, password, username } = req.body;
    try {
      // Validate input
      if (!email || !password || !username) {
        return res.status(400).json({
          success: false,
          message: "Email, password, and username are required",
        });
      }

      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email or username already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate UUID
      const userId = uuidv4();

      // Generate JWT token
      const token = jwt.sign(
        { userId, email, username },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      // Generate session ID
      const sessionId = uuidv4();

      const newUser = new User({
        userId,
        username,
        email,
        password: hashedPassword,
        sessionId,
        token,
      });

      const savedUser = await newUser.save();

      // Store session in Redis
      await redis.setex(
        `session:${sessionId}`,
        24 * 60 * 60, // 24 hours in seconds
        JSON.stringify({ userId, username, email })
      );

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          userId: savedUser.userId,
          username: savedUser.username,
          email: savedUser.email,
          sessionId: savedUser.sessionId,
          token: savedUser.token,
        },
      });
    } catch (error) {
      console.log("Error creating User: ", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
}

// Function for user login
async function handleLoginUser(req, res){
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate new session ID
      const sessionId = uuidv4();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.userId, email: user.email, username: user.username },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      // Update user with new session and token
      user.sessionId = sessionId;
      user.token = token;
      user.updatedAt = new Date();
      await user.save();

      // Store session in Redis
      await redis.setex(
        `session:${sessionId}`,
        24 * 60 * 60,
        JSON.stringify({ userId: user.userId, username: user.username, email: user.email })
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          userId: user.userId,
          username: user.username,
          email: user.email,
          sessionId: user.sessionId,
          token: user.token,
        },
      });
    } catch (error) {
      console.log("Error logging in: ", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
}

// Function for user logout
async function handleLogoutUser(req, res){
    const { sessionId } = req.body;
    try {
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: "Session ID is required",
        });
      }

      // Remove session from Redis
      await redis.del(`session:${sessionId}`);

      // Clear session from database
      const user = await User.findOneAndUpdate(
        { sessionId },
        { sessionId: null, token: null },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.log("Error logging out: ", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
}

// Function for verify session
async function handleVerifySession(req, res){
    const { sessionId } = req.body;
    try {
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: "Session ID is required",
        });
      }

      const sessionData = await redis.get(`session:${sessionId}`);
      if (!sessionData) {
        return res.status(401).json({
          success: false,
          message: "Session expired or invalid",
        });
      }

      res.status(200).json({
        success: true,
        message: "Session is valid",
        data: JSON.parse(sessionData),
      });
    } catch (error) {
      console.log("Error verifying session: ", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
}

// Function for get user
async function handleGetUser(req, res){
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        console.log("Error fetching User: ", error.message);
        res.status(400).json({ success: false, message: "Server Error" });
      }
}

export {
    handleCreateUser,
    handleLoginUser,
    handleLogoutUser,
    handleVerifySession,
    handleGetUser,
};