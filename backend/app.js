import express from 'express';
import product from './routes/productroute.js';
import user from './routes/userroute.js';
import error from './middleware/error.js';
import cookieParser from 'cookie-parser';
import  order  from './routes/orderroute.js';
import cors from 'cors';
const app = express(); 

// MIDDLEWARES
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
// USING ROUTE

app.use("/api/v1", product);
app.use("/api/v1",user);
app.use("/api/v1",order);

app.use(error);
export default app;



