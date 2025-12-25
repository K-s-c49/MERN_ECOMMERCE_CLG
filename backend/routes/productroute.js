import express from 'express';
import { createproduct, deleteproduct, getallproducts, getsingleproduct, updateproduct } from '../controller/productcontoller.js';
const router = express.Router();

// ROUTES

router.route("/products")
.get(getallproducts)
.post(createproduct);

router.route("/product/:id")
.put(updateproduct)
.delete(deleteproduct)
.get(getsingleproduct);
export default router;