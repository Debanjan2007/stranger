import mongoose from "mongoose";

const connectDb = async () => {
    try {
        connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_URL_DB_NAME}`);
        console.log(connectionInstance);
        console.log("Database connected successfully : ", connectionInstance.connections.host);
    } catch (error) {
        if(error) {
            console.log(`Database connection failed: ${error.message}`);
            process.exit(1);
        }
    }
}

export {
    connectDb
}