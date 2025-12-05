import jwt from "jsonwebtoken";

// Verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch (error) {
        return null;
    }
};

// Generate Access Token (short-lived)
export const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.userId, email: user.email, username: user.username, role: user.role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "15m" }
    );
};

// Generate Refresh Token (long-lived)
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.userId },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
    );
};

// Decode token without verification (for payload inspection)
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
};

// Validate token expiration
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
};
