import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		console.log("Connecting to MongoDB...");
		console.log("mongo_uri: ", process.env.MONGO_URI);
		
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
			socketTimeoutMS: 45000, // Close sockets after 45s
		});
		
		console.log(`MongoDB Connected: ${conn.connection.host}`);
		
		// Handle connection errors after initial connection
		mongoose.connection.on('error', (err) => {
			console.error('MongoDB connection error:', err);
		});
		
		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB disconnected, trying to reconnect...');
		});
		
		mongoose.connection.on('reconnected', () => {
			console.log('MongoDB reconnected');
		});
		
		return true;
	} catch (error) {
		console.error("Error connecting to MongoDB:", error.message);
		
		// Don't exit the process in development mode, allow the app to run without DB
		if (process.env.NODE_ENV === 'production') {
			console.error("Exiting application due to database connection failure");
			process.exit(1); // 1 is failure, 0 status code is success
		} else {
			console.warn("Running in development mode without MongoDB connection");
			return false;
		}
	}
};
