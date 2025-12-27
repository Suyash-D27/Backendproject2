import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  requireFields,
  validateObjectId,
  validateVitals
} from "../utils/validators.js";

import HealthRecordService from "../services/healthRecord.service.js";

/**
 * Create health record for an appointment
 */
export const createHealthRecord = asyncHandler(async (req, res) => {
  requireFields(req.body, ["appointmentId"]);
  validateObjectId(req.body.appointmentId, "appointmentId");

  const record = await HealthRecordService.createHealthRecord({
    appointmentId: req.body.appointmentId,
    user: req.user
  });

  return res
    .status(201)
    .json(new ApiResponse(201, record, "Health record created"));
});

/**
 * Add or update vitals
 */
export const addVitals = asyncHandler(async (req, res) => {
  validateObjectId(req.params.recordId, "recordId");
  requireFields(req.body, ["vitals"]);
  validateVitals(req.body.vitals);

  const record = await HealthRecordService.addVitals({
    recordId: req.params.recordId,
    vitals: req.body.vitals,
    user: req.user
  });

  return res
    .status(200)
    .json(new ApiResponse(200, record, "Vitals updated"));
});

/**
 * Add diagnosis and clinical notes
 * (Doctor only – enforced in service)
 */
export const addDiagnosis = asyncHandler(async (req, res) => {
  validateObjectId(req.params.recordId, "recordId");
  requireFields(req.body, ["diagnosis"]);

  const record = await HealthRecordService.addDiagnosis({
    recordId: req.params.recordId,
    diagnosis: req.body.diagnosis,
    notes: req.body.notes,
    user: req.user
  });

  return res
    .status(200)
    .json(new ApiResponse(200, record, "Diagnosis added"));
});

/**
 * Finalize health record
 */
export const finalizeHealthRecord = asyncHandler(async (req, res) => {
  validateObjectId(req.params.recordId, "recordId");

  const record = await HealthRecordService.finalizeHealthRecord({
    recordId: req.params.recordId,
    user: req.user
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, record, "Health record finalized")
    );
};
