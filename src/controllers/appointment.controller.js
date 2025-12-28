import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  requireFields,
  validateObjectId,
  validatePagination
} from "../utils/validators.js";

import AppointmentService from "../services/appointment.service.js";

/**
 * Create appointment
 * (Patient / Reception)
 */
export const createAppointment = asyncHandler(async (req, res) => {
  requireFields(req.body, ["patientId", "doctorId", "appointmentDate"]);

  validateObjectId(req.body.patientId, "patientId");
  validateObjectId(req.body.doctorId, "doctorId");

  const appointment = await AppointmentService.createAppointment({
    ...req.body,
    createdBy: req.user.userId,
    hospitalId: req.user.hospitalId
  });

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, "Appointment created successfully"));
});

/**
 * Update appointment status
 * (Reception starts, Doctor completes)
 */
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  requireFields(req.body, ["status"]);
  validateObjectId(req.params.appointmentId, "appointmentId");

  const appointment = await AppointmentService.updateAppointmentStatus({
    appointmentId: req.params.appointmentId,
    status: req.body.status,
    user: req.user
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, appointment, "Appointment status updated")
    );
});

/**
 * Get appointments
 * (Doctor / Patient / Hospital view)
 */
export const getAppointments = asyncHandler(async (req, res) => {
  const { page, limit } = validatePagination(req.query);

  const appointments = await AppointmentService.getAppointments({
    user: req.user,
    page,
    limit
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments fetched successfully")
    );
});
