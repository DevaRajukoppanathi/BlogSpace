
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {

        // Step 1: Get token from request headers
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. Please log in."
            });
        }

        // Step 2: Extract token
        const token = authHeader.split(" ")[1];

        // Step 3: Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Step 4: Find user using userId from token
        const user = await User.findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found. Please log in again."
            });
        }

        // Step 5: Attach user to request
        req.user = user;

        // Step 6: Continue to next middleware or route
        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }
};

module.exports = authMiddleware;
