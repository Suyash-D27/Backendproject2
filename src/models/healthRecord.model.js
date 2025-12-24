import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true
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

    visitDate: {
      type: Date,
      required: true
    },

    vitals: {
        age: Number,
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"]
        },
        weight: Number,
        bloodPressure: String,

        oxygenLevel: {
            type: Number,   // SpO2 percentage
            min: 0,
            max: 100
        }
    },


    notes: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN"
    }
  },
  {
    timestamps: true
  }
);

const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);

export default HealthRecord;
