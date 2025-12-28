import express from "express";
import {
  createHealthRecord,
  addVitals,
  addDiagnosis,
  finalizeHealthRecord
} from "../controllers/healthRecord.controller.js";

import auth from "../middlewares/auth.middleware.js";
import verified from "../middlewares/verified.middleware.js";
import hospitalScope from "../middlewares/hospitalScope.middleware.js";

const router = express.Router();

router.post("/", auth, verified, hospitalScope, createHealthRecord);
router.patch("/:recordId/vitals", auth, verified, hospitalScope, addVitals);
router.patch("/:recordId/diagnosis", auth, verified, hospitalScope, addDiagnosis);
router.patch("/:recordId/finalize", auth, verified, hospitalScope, finalizeHealthRecord);

export default router;
