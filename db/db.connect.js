import 'dotenv/config'
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoInstance = await mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_URL_DB_NAME}`)
        console.log(`MongoDB connected: ${mongoInstance.connection.host}`);    
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

export {
    connectDB
}