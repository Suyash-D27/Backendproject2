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

router.post("/", auth, createAppointment);
router.patch("/:appointmentId/status", auth, updateAppointmentStatus);
router.get("/", auth, getAppointments);

export default router;
