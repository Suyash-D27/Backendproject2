import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  requireFields,
  validateAadhaar,
  validateMedicalLicense
} from "../utils/validators.js";

import VerificationService from "../services/verification.service.js";

/**
 * Submit Aadhaar for patient verification
 */
export const submitAadhaar = asyncHandler(async (req, res) => {
  const file = req.file; // ← Aadhaar image

  if (!file) {
    throw new ApiError(400, "Aadhaar file required");
  }

  const imageUrl = await uploadToCloudinary(file.buffer, "aadhaar_docs");

  const result = await VerificationService.verifyPatientAadhaar({
    userId: req.user.userId,
    aadhaarFileUrl: imageUrl,
  });

  return res.status(200).json(
    new ApiResponse(200, result, "Aadhaar submitted successfully")
  );
});


/**
 * Submit medical license for doctor verification
 */
export const submitMedicalLicense = asyncHandler(async (req, res) => {
  requireFields(req.body, ["licenseNumber"]);
  validateMedicalLicense(req.body.licenseNumber);

  const result = await VerificationService.verifyDoctorLicense({
    userId: req.user.userId,
    licenseNumber: req.body.licenseNumber
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Medical license submitted successfully"));
});

/**
 * Get verification status
 */
export const getVerificationStatus = asyncHandler(async (req, res) => {
  const status = await VerificationService.getVerificationStatus(
    req.user.userId
  );

  return res
    .status(200)
    .json(new ApiResponse(200, status, "Verification status fetched"));
});
