import Transaction from "../models/transactionModel.js";
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";

/**
 * Upload receipt/attachment for transaction
 */
export const uploadReceiptToTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const userId = req.user?.userId;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: "File size exceeds 5MB limit",
            });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Only JPG, PNG, and PDF files are allowed",
            });
        }

        // Find transaction
        const transaction = await Transaction.findOne({
            transactionId,
            user: userId,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        // Upload to S3
        const fileUrl = await uploadToS3(file, `receipts/${userId}/${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);

        // Add attachment to transaction
        transaction.attachments.push({
            url: fileUrl,
            fileName: file.originalname,
            uploadedAt: new Date(),
        });

        await transaction.save();

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                url: fileUrl,
                fileName: file.originalname,
            },
        });
    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "File upload failed",
        });
    }
};

/**
 * Delete attachment from transaction
 */
export const deleteReceiptFromTransaction = async (req, res) => {
    try {
        const { transactionId, attachmentIndex } = req.params;
        const userId = req.user?.userId;

        const transaction = await Transaction.findOne({
            transactionId,
            user: userId,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const attachment = transaction.attachments[parseInt(attachmentIndex)];
        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: "Attachment not found",
            });
        }

        // Delete from S3
        await deleteFromS3(attachment.url);

        // Remove from transaction
        transaction.attachments.splice(parseInt(attachmentIndex), 1);
        await transaction.save();

        res.status(200).json({
            success: true,
            message: "Attachment deleted successfully",
        });
    } catch (error) {
        console.error("File deletion error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "File deletion failed",
        });
    }
};

/**
 * Get all attachments for transaction
 */
export const getTransactionAttachments = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const userId = req.user?.userId;

        const transaction = await Transaction.findOne({
            transactionId,
            user: userId,
        }).select("attachments");

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        res.status(200).json({
            success: true,
            data: transaction.attachments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Bulk upload multiple receipts
 */
export const bulkUploadReceipts = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const userId = req.user?.userId;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded",
            });
        }

        if (files.length > 5) {
            return res.status(400).json({
                success: false,
                message: "Maximum 5 files allowed per upload",
            });
        }

        const transaction = await Transaction.findOne({
            transactionId,
            user: userId,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const uploadedFiles = [];

        for (const file of files) {
            try {
                const fileUrl = await uploadToS3(file, `receipts/${userId}/${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);

                transaction.attachments.push({
                    url: fileUrl,
                    fileName: file.originalname,
                    uploadedAt: new Date(),
                });

                uploadedFiles.push({
                    url: fileUrl,
                    fileName: file.originalname,
                });
            } catch (error) {
                console.error(`Failed to upload ${file.originalname}:`, error);
            }
        }

        if (uploadedFiles.length > 0) {
            await transaction.save();
        }

        res.status(200).json({
            success: true,
            message: `${uploadedFiles.length} file(s) uploaded successfully`,
            data: uploadedFiles,
        });
    } catch (error) {
        console.error("Bulk upload error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Bulk upload failed",
        });
    }
};
