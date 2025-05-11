import jwt from "jsonwebtoken";
import { Types } from 'mongoose';

export const verifyToken = (req, res, next) => {
	// Get token from cookies or authorization header
	const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
	
	if (!token) {
		// Always require authentication in production
		if (process.env.NODE_ENV !== 'production') {
			// For development only: generate a valid MongoDB ObjectId
			// This ensures users don't see each other's tasks even in development
			const devObjectId = new Types.ObjectId();
			req.user = { userId: devObjectId.toString() };
			console.log(`No token provided, using development user ID: ${req.user.userId}`);
			return next();
		}
		return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	}
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		// Set the user ID from the token
		req.user = { userId: decoded.userId };
		next();
	} catch (error) {
		console.log("Error in verifyToken:", error.message);
		
		// For development only: generate a valid MongoDB ObjectId if token verification fails
		if (process.env.NODE_ENV !== 'production') {
			const devObjectId = new Types.ObjectId();
			req.user = { userId: devObjectId.toString() };
			console.log(`Token verification failed, using development user ID: ${req.user.userId}`);
			return next();
		}
		
		return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
	}
};
