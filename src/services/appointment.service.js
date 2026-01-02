import Appointment from "../models/Appointment.model.js";
import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { validateAadhaar } from "../utils/validators.js";
import { APPOINTMENT_STATUS } from "../config/constants/appointmentStatus.js";
import { ROLES } from "../config/constants/roles.js";

class AppointmentService {
  static async createAppointment(data, currentUser) {
    const { doctorId, hospitalId, appointmentDate, reasonForVisit, bookingType, patientDetails } = data;
    // bookingType: 'SELF' or 'OTHER'

    // 1. Validate Doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== ROLES.DOCTOR) {
      throw new ApiError(404, "Doctor not found or invalid");
    }

    // 2. Identify/Create Patient
    let patientId = data.patientId; // If provided, use existing
    let patient;

    if (!patientId) {
      if (!patientDetails) {
        throw new ApiError(400, "Patient details required for new patient");
      }

      // Contact Validation (New Requirement)
      if (!patientDetails.email && !patientDetails.phone) {
        throw new ApiError(400, "Patient contact details (email or phone) required");
      }


      // ---------------------------------------------------------
      // FINAL FIRST-APPOINTMENT FLOW (STRICT)
      // ---------------------------------------------------------

      // 2A. Check for Existing Patient (by Aadhaar)
      if (patientDetails.aadhaar) {
        patient = await Patient.findOne({ aadhaar: patientDetails.aadhaar });
      }

      // 2B. If User is booking for SELF, check if they are already a patient (by userId) - Defensive check
      if (bookingType === 'SELF' && !patient) {
        patient = await Patient.findOne({ userId: currentUser.userId });
      }

      // 2C. If Patient NOT Found -> Create NEW Patient
      if (!patient) {
        // STRICT VALIDATION for NEW Patients
        const missingFields = [];
        if (!patientDetails.aadhaar) missingFields.push('aadhaar');
        if (!patientDetails.name) missingFields.push('name');
        if (!patientDetails.dob) missingFields.push('dob');
        if (!patientDetails.bloodGroup) missingFields.push('bloodGroup');
        if (!patientDetails.password) missingFields.push('password (for patient login)');

        if (missingFields.length > 0) {
          throw new ApiError(400, `New Patient Registration requires: ${missingFields.join(', ')}`);
        }

        // Validate formats
        validateAadhaar(patientDetails.aadhaar);

        // Generate Patient UID
        const patientUid = "pat-" + Math.random().toString(36).substr(2, 6).toLowerCase();

        // Hash Password
        const hashedPassword = await bcrypt.hash(patientDetails.password, 10);

        // Create Patient
        patient = await Patient.create({
          ...patientDetails,
          patientUid: patientUid,
          password: hashedPassword,
          isVerified: false,
          userId: (bookingType === 'SELF') ? currentUser.userId : undefined // Link if Self
        });

        // ROLE UPGRADE (If Self)
        if (bookingType === 'SELF') {
          await User.findByIdAndUpdate(currentUser.userId, {
            role: ROLES.PATIENT
            // Note: uniqueId for User is no longer the main ID. patientUid is the key.
          });
        }
      } else {
        // Patient Exists
        // If SELF booking, ensure the existing patient is linked to this user (if not already)
        if (bookingType === 'SELF' && !patient.userId) {
          patient.userId = currentUser.userId;
          await patient.save();
          await User.findByIdAndUpdate(currentUser.userId, { role: ROLES.PATIENT });
        }
      }

      patientId = patient._id;
    }

    // 3. Create Appointment
    const appointment = await Appointment.create({
      bookedByUserId: currentUser.userId, // Who clicked "Book"
      patientId: patientId,               // Who is getting treated
      doctorId,
      hospitalId,
      appointmentDate,
      reasonForVisit,
      status: APPOINTMENT_STATUS.SCHEDULED
    });

    return appointment;
  }

  // Start Appointment 


  static async startAppointment(appointmentId, currentUser) {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    if (appointment.status !== APPOINTMENT_STATUS.SCHEDULED) {
      throw new ApiError(400, "Appointment cannot be started");
    }

    // Only reception or doctor
    if (![ROLES.RECEPTION, ROLES.DOCTOR].includes(currentUser.role)) {
      throw new ApiError(403, "Not allowed to start appointment");
    }

    // Hospital scope
    if (appointment.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Hospital access violation");
    }

    appointment.status = APPOINTMENT_STATUS.IN_PROGRESS;
    await appointment.save();

    return appointment;
  }

  // complete Appointment 
  static async completeAppointment(appointmentId, currentUser) {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    if (appointment.status !== APPOINTMENT_STATUS.IN_PROGRESS) {
      throw new ApiError(400, "Appointment not in progress");
    }

    // Doctor only
    if (currentUser.role !== ROLES.DOCTOR) {
      throw new ApiError(403, "Only doctor can complete appointment");
    }

    appointment.status = APPOINTMENT_STATUS.COMPLETED;
    await appointment.save();

    return appointment;
  }
  // Cancel Appointment 

  static async cancelAppointment(appointmentId, currentUser) {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    if (appointment.status !== APPOINTMENT_STATUS.SCHEDULED) {
      throw new ApiError(400, "Only scheduled appointments can be cancelled");
    }

    // Patient or reception
    if (![ROLES.PATIENT, ROLES.RECEPTION].includes(currentUser.role)) {
      throw new ApiError(403, "Not allowed to cancel appointment");
    }

    appointment.status = APPOINTMENT_STATUS.CANCELLED;
    await appointment.save();

    return appointment;
  }
  static async getDoctorAppointments(currentUser) {
    if (currentUser.role !== ROLES.DOCTOR) {
      throw new ApiError(403, "Doctor access only");
    }

    return Appointment.find({
      doctorId: currentUser.userId,
      hospitalId: currentUser.hospitalId,
      status: { $ne: APPOINTMENT_STATUS.CANCELLED },
    }).sort({ date: 1 });
  }
}

export default AppointmentService;

