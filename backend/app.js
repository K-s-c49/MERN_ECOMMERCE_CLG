import express from 'express';
import product from './routes/productroute.js';
const app = express(); 

// MIDDLEWARES

app.use(express.json());
// USING ROUTE

app.use("/api/v1", product);
export default app;



