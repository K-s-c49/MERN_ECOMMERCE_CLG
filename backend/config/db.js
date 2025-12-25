import mongoose from "mongoose";

export const connectMongodatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`Database connected successfully ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error(`Database connection error: ${err.message}`);
        throw err;
    }
};
