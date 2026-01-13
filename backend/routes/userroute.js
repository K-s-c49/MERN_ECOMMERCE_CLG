import express from "express";
import { Router } from "express";
import { deleteUser, getSinghleUser, getUserDetails, getUsersList, loginuser, logoutuser, registeruser, requestPasswordReset, resetPassword, updatePassword, updateUserProfile, updateUserRole , } from "../controller/usercontroller.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";


const router = Router();

router.route("/register").post(registeruser);
router.route("/login").post(loginuser);
router.route("/logout").post(logoutuser);
router.route("/password/forgot").post(requestPasswordReset);
router.route("/reset/:token").post(resetPassword);
router.route("/profile").get(verifyUserAuth,getUserDetails);
router.route("/password/update").post(verifyUserAuth, updatePassword);
router.route("/profile/update").put(verifyUserAuth, updateUserProfile);
router.route("/admin/users").get(verifyUserAuth, roleBasedAccess("admin"), getUsersList);
router.route("/admin/user/:id").get(verifyUserAuth, roleBasedAccess("admin"), getSinghleUser)
.put(verifyUserAuth, roleBasedAccess("admin"), updateUserRole)
.delete(verifyUserAuth, roleBasedAccess("admin"),deleteUser);


export default router;
