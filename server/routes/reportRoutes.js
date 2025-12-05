import express from "express";
import {
    getDashboard,
    getFinancialReport,
    exportTransactions,
} from "../controllers/reportController.js";
import { authenticate } from "../middleware/rbac.js";

const router = express.Router();

// All report routes require authentication
router.use(authenticate);

// Get dashboard analytics
router.get("/dashboard", getDashboard);

// Get financial report
router.get("/financial-report", getFinancialReport);

// Export transactions
router.get("/export", exportTransactions);

export default router;
