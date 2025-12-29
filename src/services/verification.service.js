import  User from "../models/user.model.js";
import  Patient  from "../models/patient.model.js";
import  Doctor  from "../models/doctor.model.js";
import  ApiError  from "../utils/ApiError.js";
import { ROLES } from "../config/constants/roles.js";

class VerificationService {

  // 1️⃣ Verify Patient Aadhaar
  static async verifyPatientAadhaar(patientId, aadhaarNumber, currentUser) {

    // System / Admin level action
    if (![ROLES.HOSPITAL_ADMIN, ROLES.SUPER_ADMIN].includes(currentUser.role)) {
      throw new ApiError(403, "Not authorized to verify patient");
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    // Aadhaar number must match
    if (patient.aadhaarNumber !== aadhaarNumber) {
      throw new ApiError(400, "Aadhaar number mismatch");
    }

    // Mark patient verified
    patient.aadhaarVerified = true;
    await patient.save();

    // Update user verification
    await User.findByIdAndUpdate(patient.userId, {
      isVerified: true,
      verificationType: "AADHAAR",
      verifiedAt: new Date(),
    });

    return {
      message: "Patient Aadhaar verified successfully",
    };
  }

  // 2️⃣ Verify Doctor License
  static async verifyDoctorLicense(doctorId, licenseNumber, currentUser) {

    // Only hospital admin or super admin
    if (![ROLES.HOSPITAL_ADMIN, ROLES.SUPER_ADMIN].includes(currentUser.role)) {
      throw new ApiError(403, "Not authorized to verify doctor");
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }

    


    // Hospital admin can verify only own hospital doctors
    if (
      currentUser.role === ROLES.HOSPITAL_ADMIN &&
      doctor.hospitalId.toString() !== currentUser.hospitalId
    ) {
      throw new ApiError(403, "Hospital scope violation");
    }

    if (doctor.licenseNumber !== licenseNumber) {
      throw new ApiError(400, "License number mismatch");
    }

    // Mark doctor verified
    doctor.licenseVerified = true;
    await doctor.save();

    // Update user verification
    await User.findByIdAndUpdate(doctor.userId, {
      isVerified: true,
      verificationType: "LICENSE",
      verifiedAt: new Date(),
    });

    return {
      message: "Doctor license verified successfully",
    };
  }

   static async submitLicense({ userId, licenseFileUrl }) {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) throw new Error("Doctor profile not found");

  doctor.licenseFileUrl = licenseFileUrl;
  await doctor.save();

  return doctor;
}


  // 3️⃣ Reject Verification (Patient / Doctor)
  static async rejectVerification(userId, reason, currentUser) {

    if (![ROLES.HOSPITAL_ADMIN, ROLES.SUPER_ADMIN].includes(currentUser.role)) {
      throw new ApiError(403, "Not authorized to reject verification");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.isVerified = false;
    user.verificationRejected = true;
    user.rejectionReason = reason;

    await user.save();

    return {
      message: "Verification rejected",
      reason,
    };
  }
}

export default VerificationService;
