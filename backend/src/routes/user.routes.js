import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  changeCurrentPassword,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// User registration route
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secure Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;
