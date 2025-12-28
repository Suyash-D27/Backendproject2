import express from "express";
import {
  createPrescription,
  addMedicine,
  updatePrescription
} from "../controllers/prescription.controller.js";

import auth from "../middlewares/auth.middleware.js";
import verified from "../middlewares/verified.middleware.js";
import hospitalScope from "../middlewares/hospitalScope.middleware.js";

const router = express.Router();

router.post("/", auth, verified, hospitalScope, createPrescription);
router.patch("/:prescriptionId/medicine", auth, verified, hospitalScope, addMedicine);
router.patch("/:prescriptionId", auth, verified, hospitalScope, updatePrescription);

export default router;
