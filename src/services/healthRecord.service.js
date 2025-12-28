import  HealthRecord  from "../models/HealthRecord.model.js";
import  Appointment  from "../models/Appointment.model.js";
import  ApiError  from "../utils/ApiError.js";
import {ROLES
} from "../config/constants/roles.js";
import {APPOINTMENT_STATUS} from "../config/constants/appointmentStatus.js";
import {HEALTH_RECORD_STATUS} from "../config/constants/healthRecordStatus.js"; 

class HealthRecordService {

    // create Heathrecord 

  static async createHealthRecord(appointmentId, currentUser) {
    // Fetch appointment
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    // Appointment must be in progress
    if (appointment.status !== APPOINTMENT_STATUS.IN_PROGRESS) {
      throw new ApiError(
        400,
        "Health record can be created only during active visit"
      );
    }

    // Hospital isolation
    if (appointment.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Hospital access violation");
    }

    // Prevent duplicate health record
    const existing = await HealthRecord.findOne({ appointmentId });
    if (existing) {
      throw new ApiError(409, "Health record already exists");
    }

    // Create record
    const record = await HealthRecord.create({
      appointmentId,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      hospitalId: appointment.hospitalId,
      status: HEALTH_RECORD_STATUS.ACTIVE,
      createdBy: currentUser.userId,
    });

    return record;
  }

  // ADD vitals 

  static async addVitals(recordId, vitals, currentUser) {
    const record = await HealthRecord.findById(recordId);

    if (!record) {
      throw new ApiError(404, "Health record not found");
    }

    if (record.status === HEALTH_RECORD_STATUS.FINALIZED) {
      throw new ApiError(400, "Health record is finalized");
    }

    // Role check
    if (![ROLES.DOCTOR, ROLES.RECEPTION].includes(currentUser.role)) {
      throw new ApiError(403, "Not allowed to add vitals");
    }

    // Hospital isolation
    if (record.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Hospital access violation");
    }

    // Update vitals
    record.vitals = {
      ...record.vitals,
      ...vitals,
    };

    await record.save();
    return record;
  }

  // ADD diagnosis

  static async addDiagnosis(recordId, diagnosisData, currentUser) {
    const record = await HealthRecord.findById(recordId);

    if (!record) {
      throw new ApiError(404, "Health record not found");
    }

    if (record.status === HEALTH_RECORD_STATUS.FINALIZED) {
      throw new ApiError(400, "Health record is finalized");
    }

    // Doctor only
    if (currentUser.role !== ROLES.DOCTOR) {
      throw new ApiError(403, "Only doctor can add diagnosis");
    }

    // Verification check
    if (!currentUser.isVerified) {
      throw new ApiError(403, "Doctor verification required");
    }

    record.diagnosis = diagnosisData;
    record.diagnosedBy = currentUser.userId;

    await record.save();
    return record;
  }


  // finalizeHealthRecord 

  static async finalizeHealthRecord(recordId, currentUser) {
    const record = await HealthRecord.findById(recordId);

    if (!record) {
      throw new ApiError(404, "Health record not found");
    }

    if (record.status === HEALTH_RECORD_STATUS.FINALIZED) {
      throw new ApiError(400, "Health record already finalized");
    }

    // Doctor only
    if (currentUser.role !== ROLES.DOCTOR) {
      throw new ApiError(403, "Only doctor can finalize record");
    }

    if (!record.diagnosis) {
      throw new ApiError(400, "Diagnosis required before finalization");
    }

    record.status = HEALTH_RECORD_STATUS.FINALIZED;
    record.finalizedAt = new Date();

    await record.save();
    return record;
  }
}

export default HealthRecordService;
