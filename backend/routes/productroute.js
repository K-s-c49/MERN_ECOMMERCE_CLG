import express from 'express';
import { createproduct, deleteproduct, getallproducts, getsingleproduct, updateproduct } from '../controller/productcontoller.js';
import {roleBasedAccess, verifyUserAuth} from '../middleware/userAuth.js';
const router = express.Router();

// ROUTES

router.route("/products")
.get(verifyUserAuth,getallproducts)
.post(verifyUserAuth,roleBasedAccess("admin"),createproduct);

router.route("/product/:id")
.put(verifyUserAuth,roleBasedAccess("admin"),updateproduct)
.delete(verifyUserAuth,roleBasedAccess("admin"),deleteproduct)
.get(verifyUserAuth,getsingleproduct);
export default router;