import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    bookedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },

    appointmentDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED"
    },

    reasonForVisit: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
