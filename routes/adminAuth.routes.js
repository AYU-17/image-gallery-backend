import express from "express"
import { authAdmin } from "../middleware/authAdmin.js";
import { loginAdmin, registerAdmin, logoutAdmin } from "../controllers/adminAuth.controller.js";

const router = express.Router();


router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);


export const adminAuthRoutes = router;