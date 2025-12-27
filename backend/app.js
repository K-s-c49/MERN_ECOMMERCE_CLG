import express from 'express';
import product from './routes/productroute.js';
import user from './routes/userroute.js';
import error from './middleware/error.js';
import cookieParser from 'cookie-parser';
const app = express(); 

// MIDDLEWARES

app.use(express.json());
app.use(cookieParser());
// USING ROUTE

app.use("/api/v1", product);
app.use("/api/v1",user);

app.use(error);
export default app;



