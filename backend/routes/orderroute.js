import express from "express";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
import { allmyOrders, createorder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../controller/ordercontroller.js";
const router = express.Router();

router.route("/new/order").post(verifyUserAuth, createorder);
// Public route for authenticated users to fetch a single order by id
router.route("/order/:id").get(verifyUserAuth, getSingleOrder);
router.route("/admin/order/:id").get(verifyUserAuth,roleBasedAccess('admin'), getSingleOrder).put(verifyUserAuth,roleBasedAccess('admin'), updateOrderStatus).delete(verifyUserAuth,roleBasedAccess('admin'), deleteOrder);
router.route("/admin/orders").get(verifyUserAuth,roleBasedAccess('admin'), getAllOrders);
router.route("/orders/user").get(verifyUserAuth, allmyOrders);
export default router;