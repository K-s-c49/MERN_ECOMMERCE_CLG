import express from 'express';
import product from './routes/productroute.js';
import error from './middleware/error.js';
const app = express(); 

// MIDDLEWARES

app.use(express.json());
// USING ROUTE

app.use("/api/v1", product);
app.use(error);
export default app;



