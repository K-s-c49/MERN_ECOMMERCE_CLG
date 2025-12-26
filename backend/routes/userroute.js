import express from "express";
import { Router } from "express";
import { registeruser } from "../controller/usercontroller";

const router = express.Router();

Router.router("/resgister").post(registeruser);
export default router;
