import { Appointment } from "../models/Appointment.model.js";
import { HealthRecord } from "../models/HealthRecord.model.js";
import { Prescription } from "../models/Prescription.model.js";
import { Test } from "../models/Test.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ROLES, TEST_STATUS } from "../config/constants";

class PatientHistoryService {

  // 1️⃣ Get Full Patient History
  static async getPatientHistory(patientId, currentUser) {

    // ---- ACCESS CONTROL ----

    // Patient can view only own history
    if (
      currentUser.role === ROLES.PATIENT &&
      currentUser.userId !== patientId
    ) {
      throw new ApiError(403, "Patients can view only their own history");
    }

    // Doctor access is hospital-scoped
    if (currentUser.role === ROLES.DOCTOR) {
      // allowed, but hospital check happens later
    }

    // Other roles not allowed
    if (![ROLES.PATIENT, ROLES.DOCTOR].includes(currentUser.role)) {
      throw new ApiError(403, "Access denied");
    }

    // ---- FETCH APPOINTMENTS ----

    const appointments = await Appointment.find({
      patientId,
      hospitalId: currentUser.hospitalId,
    }).sort({ date: -1 });

    if (!appointments.length) {
      return {
        patientId,
        history: [],
      };
    }

    const appointmentIds = appointments.map(a => a._id);

    // ---- FETCH HEALTH RECORDS ----

    const healthRecords = await HealthRecord.find({
      appointmentId: { $in: appointmentIds },
    });

    const recordMap = {};
    healthRecords.forEach(r => {
      recordMap[r.appointmentId.toString()] = r;
    });

    // ---- FETCH PRESCRIPTIONS ----

    const prescriptions = await Prescription.find({
      healthRecordId: { $in: healthRecords.map(r => r._id) },
    });

    const prescriptionMap = {};
    prescriptions.forEach(p => {
      prescriptionMap[p.healthRecordId.toString()] = p;
    });

    // ---- FETCH TESTS (Only Uploaded Reports) ----

    const tests = await Test.find({
      healthRecordId: { $in: healthRecords.map(r => r._id) },
      status: TEST_STATUS.REPORT_UPLOADED,
    });

    const testMap = {};
    tests.forEach(t => {
      if (!testMap[t.healthRecordId]) {
        testMap[t.healthRecordId] = [];
      }
      testMap[t.healthRecordId].push(t);
    });

    // ---- BUILD TIMELINE ----

    const history = appointments.map(appointment => {
      const record = recordMap[appointment._id.toString()];
      if (!record) return null;

      return {
        appointment,
        healthRecord: {
          vitals: record.vitals,
          diagnosis: record.diagnosis,
          finalizedAt: record.finalizedAt,
        },
        prescription: prescriptionMap[record._id.toString()] || null,
        tests: testMap[record._id.toString()] || [],
      };
    }).filter(Boolean);

    return {
      patientId,
      history,
    };
  }
}

export default PatientHistoryService;
