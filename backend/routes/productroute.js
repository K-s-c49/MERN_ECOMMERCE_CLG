import express from 'express';
import { createproduct, createReviewProduct, deleteproduct, deleteReview, getadminproducts, getallproducts, getProductReviews, getsingleproduct, updateproduct } from '../controller/productcontoller.js';
import {roleBasedAccess, verifyUserAuth} from '../middleware/userAuth.js';
const router = express.Router();

// ROUTES

router.route("/products")
.get(getallproducts);

router.route("/product/:id")
.get(getsingleproduct);

router.route("/review").put(verifyUserAuth,createReviewProduct);

router.route("/reviews").get(getProductReviews).delete(verifyUserAuth,deleteReview);

router.route("/admin/products")
.get(verifyUserAuth,roleBasedAccess("admin"),getadminproducts);

router.route("/admin/products/create")
.get(verifyUserAuth,getallproducts)
.post(verifyUserAuth,roleBasedAccess("admin"),createproduct);

router.route("/admin/product/:id")
.put(verifyUserAuth,roleBasedAccess("admin"),updateproduct)
.delete(verifyUserAuth,roleBasedAccess("admin"),deleteproduct)
.get(verifyUserAuth,getsingleproduct);



export default router;