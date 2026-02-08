import mongoose from "mongoose";
import { DB_NAME } from "../constents.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
            dbName: DB_NAME,
            autoIndex: false,
            serverSelectionTimeoutMS: 5000,
        });

        console.log("✅ MongoDB connected successfully");
        console.log(`📡 Host: ${connectionInstance.connection.host}`);
        console.log(`📦 Database: ${connectionInstance.connection.name}`);

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("🔄 MongoDB reconnected");
        });

    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDB;
