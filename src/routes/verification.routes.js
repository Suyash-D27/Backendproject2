import express from "express";
import {
  submitAadhaar,
  submitMedicalLicense,
  getVerificationStatus
} from "../controllers/verification.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/aadhaar", authMiddleware, submitAadhaar);
router.post("/license", authMiddleware, submitMedicalLicense);
router.get("/status", authMiddleware, getVerificationStatus);

export default router;
