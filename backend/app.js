import express from 'express';
import product from './routes/productroute.js';
import user from './routes/userroute.js';
import error from './middleware/error.js';
import cookieParser from 'cookie-parser';
import  order  from './routes/orderroute.js';
import Payment from './routes/paymentroute.js';
import contact from './routes/contactroute.js';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';

const app = express(); 

// MIDDLEWARES
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp/',
    createParentPath: true,
}));
// USING ROUTE

app.use("/api/v1", product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1", Payment);
app.use("/api/v1", contact);

app.use(error);

dotenv.config({path:'./config/config.env'});

export default app;



