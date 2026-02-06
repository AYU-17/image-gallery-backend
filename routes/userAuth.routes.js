import express from "express";
import { googleLogin } from "../controllers/userAuth.controller.js";

const router = express.Router();

router.post("/google-login", googleLogin);

export const userAuthRoutes = router;