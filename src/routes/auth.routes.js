import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import multer from "multer";
import { uploadProfileImage } from "../controllers/auth.controller.js";
const upload = multer();

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.patch(
  "/profile/upload",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfileImage
);


export default router;
