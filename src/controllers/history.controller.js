import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { validateObjectId } from "../utils/validators.js";

import PatientHistoryService from "../services/patientHistory.service.js";

/**
 * Get patient medical history
 * (Patient → own history, Doctor → hospital patients)
 */
export const getPatientHistory = asyncHandler(async (req, res) => {
  const patientId = req.params.patientId || req.user.userId;

  validateObjectId(patientId, "patientId");

  const history = await PatientHistoryService.getPatientHistory({
    patientId,
    user: req.user
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, history, "Patient history fetched successfully")
    );
});
