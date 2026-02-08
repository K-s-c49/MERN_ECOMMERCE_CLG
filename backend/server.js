import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// load environment variables using path relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
import app from './app.js';
import { connectMongodatabase } from './config/db.js';
import Razarpay from 'razorpay';

connectMongodatabase();
// handle uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});
const port = process.env.PORT || 3000;
      const server =  app.listen(port, () => {
            console.log(`Server is running on ${port}`);
        });

export const instance = new Razarpay({
    key_id: process.env.RAZORPAY_KEY_ID || process.env.Razarpay_KEY_ID || process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.Razarpay_KEY_SECRET,
});


// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});