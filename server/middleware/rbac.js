// RBAC Middleware - Role-Based Access Control

const rolePermissions = {
    admin: ["read", "write", "delete", "approve", "admin"],
    manager: ["read", "write", "approve"],
    user: ["read", "write"],
};

export const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = require("jsonwebtoken").verify(
            token,
            process.env.JWT_SECRET || "your-secret-key"
        );
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export const authorize = (requiredPermissions = []) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
            }

            const userRole = req.user.role || "user";
            const userPermissions = rolePermissions[userRole] || [];

            const hasPermission = requiredPermissions.every((permission) =>
                userPermissions.includes(permission)
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: "Insufficient permissions",
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Authorization check failed",
            });
        }
    };
};

export const requireRole = (requiredRoles = []) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
            }

            if (!requiredRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: `This action requires one of these roles: ${requiredRoles.join(", ")}`,
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Role check failed",
            });
        }
    };
};

export const logAudit = async (actor, action, entity, entityId, before, after) => {
    try {
        const AuditLog = require("../models/auditLogModel.js").default;
        const { v4: uuidv4 } = require("uuid");

        await AuditLog.create({
            auditId: uuidv4(),
            actor,
            action,
            entity,
            entityId,
            before,
            after,
        });
    } catch (error) {
        console.error("Audit logging failed:", error.message);
    }
};
