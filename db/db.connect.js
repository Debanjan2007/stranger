import 'dotenv/config'
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoInstance = await mongoose.connect(`${process.env.MONGO_URL}/annonymus`)
        console.log(`MongoDB connected: ${mongoInstance.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

export {
    connectDB
}