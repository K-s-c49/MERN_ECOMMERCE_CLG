import mongoose from "mongoose";

export const connectMongodatabase = () => {
        mongoose.connect(process.env.DB_URI).then((data)=> {
        console.log(`Database connected successfully ${data.connection.host}`);
    
});
}; 