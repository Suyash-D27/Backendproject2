import  Appointment  from "../models/Appointment.model.js";
import  User  from "../models/user.model.js";
import  ApiError  from "../utils/ApiError.js";
import  {APPOINTMENT_STATUS}  from "../config/constants/appointmentStatus.js";
import { ROLES } from "../config/constants/roles.js";

class AppointmentService {
  static async createAppointment({ patientId, doctorId, date }, currentUser) {
    // Role check
    if (![ROLES.PATIENT, ROLES.RECEPTION].includes(currentUser.role)) {
      throw new ApiError(403, "Not allowed to create appointment");
    }

    // Fetch doctor & patient
    const doctor = await User.findById(doctorId);
    const patient = await User.findById(patientId);

    if (!doctor || !patient) {
      throw new ApiError(404, "Doctor or Patient not found");
    }

    // Hospital isolation
    if (doctor.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Doctor belongs to another hospital");
    }

    if (patient.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Patient belongs to another hospital");
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      hospitalId: currentUser.hospitalId,
      date,
      status: APPOINTMENT_STATUS.SCHEDULED,
      createdBy: currentUser.userId,
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

