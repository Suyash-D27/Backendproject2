import express from "express";
import {
  createAppointment,
  updateAppointmentStatus,
  getAppointments
} from "../controllers/appointment.controller.js";

import auth from "../middlewares/auth.middleware.js";
import verified from "../middlewares/verified.middleware.js";
import hospitalScope from "../middlewares/hospitalScope.middleware.js";

const router = express.Router();

router.post("/", auth, verified, hospitalScope, createAppointment);
router.patch("/:appointmentId/status", auth, verified, hospitalScope, updateAppointmentStatus);
router.get("/", auth, verified, hospitalScope, getAppointments);

export default router;
