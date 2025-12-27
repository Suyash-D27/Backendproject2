import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  requireFields,
  validateObjectId,
  validateMedicine
} from "../utils/validators.js";

import PrescriptionService from "../services/prescription.service.js";

/**
 * Create prescription for a health record
 */
export const createPrescription = asyncHandler(async (req, res) => {
  requireFields(req.body, ["healthRecordId"]);
  validateObjectId(req.body.healthRecordId, "healthRecordId");

  const prescription = await PrescriptionService.createPrescription({
    healthRecordId: req.body.healthRecordId,
    user: req.user
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, prescription, "Prescription created")
    );
});

/**
 * Add medicine to prescription
 */
export const addMedicine = asyncHandler(async (req, res) => {
  validateObjectId(req.params.prescriptionId, "prescriptionId");
  requireFields(req.body, ["medicine"]);
  validateMedicine(req.body.medicine);

  const prescription = await PrescriptionService.addMedicine({
    prescriptionId: req.params.prescriptionId,
    medicine: req.body.medicine,
    user: req.user
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, prescription, "Medicine added")
    );
});

/**
 * Update prescription (before finalization)
 */
export const updatePrescription = asyncHandler(async (req, res) => {
  validateObjectId(req.params.prescriptionId, "prescriptionId");
  requireFields(req.body, ["medicines"]);

  const prescription = await PrescriptionService.updatePrescription({
    prescriptionId: req.params.prescriptionId,
    medicines: req.body.medicines,
    user: req.user
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, prescription, "Prescription updated")
    );
});
