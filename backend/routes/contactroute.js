import { Router } from "express";
import { sendContactMessage } from "../controller/contactcontroller.js";

const router = Router();

// Public route: any user can submit contact message
router.route("/contact").post(sendContactMessage);

export default router;
