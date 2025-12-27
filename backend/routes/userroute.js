import express from "express";
import { Router } from "express";
import { loginuser, logoutuser, registeruser, requestPasswordReset } from "../controller/usercontroller.js";

const router = Router();

router.route("/register").post(registeruser);
router.route("/login").post(loginuser);
router.route("/logout").post(logoutuser);
router.route("/password/forgot").post(requestPasswordReset);

export default router;
