import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    auditId: {
        type: String,
        unique: true,
        required: true,
    },
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        enum: ["create", "update", "delete", "approve", "reject", "export"],
        required: true,
    },
    entity: {
        type: String,
        enum: ["transaction", "budget", "category", "account", "user"],
        required: true,
    },
    entityId: {
        type: String,
        required: true,
    },
    before: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    after: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    ipAddress: {
        type: String,
        default: null,
    },
    userAgent: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["success", "failure"],
        default: "success",
    },
    reason: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// Index for audit trail queries
auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
