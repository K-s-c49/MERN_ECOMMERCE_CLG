import app from './app.js';
import dotenv from 'dotenv';
import { connectMongodatabase } from './config/db.js';

dotenv.config({ path: './backend/config/config.env' });

const port = process.env.PORT || 3000;

connectMongodatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(() => {
        console.error('Failed to connect to database. Server not started.');
        process.exit(1);
    });