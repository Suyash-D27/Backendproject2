import express from "express";
import { getPatientHistory } from "../controllers/history.controller.js";

import auth from "../middlewares/auth.middleware.js";
import verified from "../middlewares/verified.middleware.js";
import hospitalScope from "../middlewares/hospitalScope.middleware.js";

const router = express.Router();

// Patient gets own history
router.get("/", auth, verified, hospitalScope, getPatientHistory);

// Doctor or admin fetches specific patient
router.get("/:patientId", auth, verified, hospitalScope, getPatientHistory);

export default router;

