import { Router } from "express";
import {
  register,
  login,
  refresh,
  sendOtp,
  verifyOtp,
  checkAuth,
  showAllUsers,
  getUserById,
  getOwnProfile,
  logout,
} from "../../controllers/authController.js";
import {
  checkAdmin,
  checkAdvocate,
  protect,
} from "../../middleware/authMiddleware.js";

const router = Router();

// OTP routes
router.post("/send-otp", sendOtp);
router.post("/logout", logout);
router.post("/verify-otp", verifyOtp);
router.get("/profile", getOwnProfile);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/check", checkAuth);
router.get("/users", protect(["admin", "client"]), showAllUsers);
router.get("/user/:id", getUserById);

export default router;
