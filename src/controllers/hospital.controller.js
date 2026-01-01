
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HospitalService from "../services/hospital.service.js";
import { requireFields } from "../utils/validators.js";

/**
 * Create Hospital (Super Admin Only)
 */
export const createHospital = asyncHandler(async (req, res) => {
    requireFields(req.body, ["name", "registrationNumber", "address"]);

    const hospital = await HospitalService.createHospital(req.body);

    return res
        .status(201)
        .json(new ApiResponse(201, hospital, "Hospital created successfully"));
});

/**
 * Get All Hospitals (Super Admin Only)
 */
export const getAllHospitals = asyncHandler(async (req, res) => {
    const hospitals = await HospitalService.getAllHospitals();

    return res
        .status(200)
        .json(new ApiResponse(200, hospitals, "Hospitals fetched successfully"));
});

/**
 * Delete Hospital (Super Admin Only)
 */
export const deleteHospital = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await HospitalService.deleteHospital(id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Hospital deleted successfully"));
});
