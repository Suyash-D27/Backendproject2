import Prescription  from "../models/Prescription.model.js";
import  HealthRecord from "../models/HealthRecord.model.js";
import  ApiError  from "../utils/ApiError.js";
import {
  ROLES,
} from "../config/constants/roles.js";
import {HEALTH_RECORD_STATUS} from "../config/constants/healthRecordStatus.js";

class PrescriptionService {

  // 1️⃣ Create Prescription (Once per Health Record)
  static async createPrescription(healthRecordId, currentUser) {
    // Doctor only
    if (currentUser.role !== ROLES.DOCTOR) {
      throw new ApiError(403, "Only doctor can create prescription");
    }

    // Doctor must be verified
    if (!currentUser.isVerified) {
      throw new ApiError(403, "Doctor verification required");
    }

    // Fetch health record
    const record = await HealthRecord.findById(healthRecordId);

    if (!record) {
      throw new ApiError(404, "Health record not found");
    }

    // Health record must be active
    if (record.status === HEALTH_RECORD_STATUS.FINALIZED) {
      throw new ApiError(400, "Health record is finalized");
    }

    // Diagnosis is mandatory
    if (!record.diagnosis) {
      throw new ApiError(400, "Diagnosis required before prescription");
    }

    // Hospital isolation
    if (record.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Hospital access violation");
    }

    // Prevent duplicate prescription
    const existing = await Prescription.findOne({ healthRecordId });
    if (existing) {
      throw new ApiError(409, "Prescription already exists");
    }

    // Create prescription
    const prescription = await Prescription.create({
      healthRecordId,
      patientId: record.patientId,
      doctorId: currentUser.userId,
      hospitalId: record.hospitalId,
      medicines: [],
      notes: "",
    });

    return prescription;
  }

  // 2️⃣ Add Medicine to Prescription
  static async addMedicine(prescriptionId, medicineData, currentUser) {
    // Doctor only
    if (currentUser.role !== ROLES.DOCTOR) {
      throw new ApiError(403, "Only doctor can add medicine");
    }

    if (!currentUser.isVerified) {
      throw new ApiError(403, "Doctor verification required");
    }

    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      throw new ApiError(404, "Prescription not found");
    }

    // Fetch health record to ensure it's not finalized
    const record = await HealthRecord.findById(prescription.healthRecordId);

    if (record.status === HEALTH_RECORD_STATUS.FINALIZED) {
      throw new ApiError(400, "Cannot modify prescription after finalization");
    }

    // Hospital isolation
    if (prescription.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Hospital access violation");
    }

    // Add medicine
    prescription.medicines.push({
      name: medicineData.name,
      dosage: medicineData.dosage,
      frequency: medicineData.frequency, // B/A, M/Af/E/N
      duration: medicineData.duration,
      instructions: medicineData.instructions,
    });

    await prescription.save();
    return prescription;
  }

  // 3️⃣ Update Prescription Notes
  static async updateNotes(prescriptionId, notes, currentUser) {
    if (currentUser.role !== ROLES.DOCTOR) {
      throw new ApiError(403, "Only doctor can update prescription");
    }

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      throw new ApiError(404, "Prescription not found");
    }

    const record = await HealthRecord.findById(prescription.healthRecordId);

    if (record.status === HEALTH_RECORD_STATUS.FINALIZED) {
      throw new ApiError(400, "Prescription is locked");
    }

    prescription.notes = notes;
    await prescription.save();

    return prescription;
  }
}

export default PrescriptionService;
