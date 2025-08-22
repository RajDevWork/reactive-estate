import express from "express";
import { googleSignin, signin, signup,signOutUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",googleSignin);
router.get("/signout",signOutUser);

export default router