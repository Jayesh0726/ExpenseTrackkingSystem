import express from "express";
import {
    createAccount,
    getAccounts,
    getAccount,
    updateAccount,
    deleteAccount,
} from "../controllers/accountController.js";
import { authenticate, authorize } from "../middleware/rbac.js";

const router = express.Router();

// All account routes require authentication
router.use(authenticate);

// Create account (requires write permission)
router.post("/", authorize(["write"]), createAccount);

// Get all accounts
router.get("/", getAccounts);

// Get single account
router.get("/:id", getAccount);

// Update account (requires write permission)
router.put("/:id", authorize(["write"]), updateAccount);

// Delete account (requires delete permission)
router.delete("/:id", authorize(["delete"]), deleteAccount);

export default router;
