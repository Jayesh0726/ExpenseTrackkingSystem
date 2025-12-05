import express from "express";
import multer from "multer";
import { authenticate, authorize } from "../middleware/rbacMiddleware.js";
import {
    uploadReceiptToTransaction,
    deleteReceiptFromTransaction,
    getTransactionAttachments,
    bulkUploadReceipts,
} from "../controllers/uploadController.js";

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ["image/jpeg", "image/png", "application/pdf"];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPG, PNG, PDF allowed"));
        }
    },
});

/**
 * @route   POST /api/upload/:transactionId
 * @desc    Upload single receipt/attachment
 * @access  Private
 */
router.post(
    "/:transactionId",
    authenticate,
    authorize(["write"]),
    upload.single("file"),
    uploadReceiptToTransaction
);

/**
 * @route   POST /api/upload/:transactionId/bulk
 * @desc    Upload multiple receipts
 * @access  Private
 */
router.post(
    "/:transactionId/bulk",
    authenticate,
    authorize(["write"]),
    upload.array("files", 5),
    bulkUploadReceipts
);

/**
 * @route   GET /api/upload/:transactionId
 * @desc    Get all attachments for transaction
 * @access  Private
 */
router.get(
    "/:transactionId",
    authenticate,
    getTransactionAttachments
);

/**
 * @route   DELETE /api/upload/:transactionId/:attachmentIndex
 * @desc    Delete specific attachment
 * @access  Private
 */
router.delete(
    "/:transactionId/:attachmentIndex",
    authenticate,
    authorize(["write"]),
    deleteReceiptFromTransaction
);

export default router;
