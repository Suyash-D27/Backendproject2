import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      sparse: true,
      unique: true // A user can only be ONE patient (Self). Family members have no userId.
    },

    age: {
      type: Number,
      required: true
    },

    // Validated Identity Fields
    name: { type: String, trim: true, required: true },
    dob: { type: Date, required: true },
    aadhaar: { type: String, trim: true, sparse: true, unique: true, required: true },

    // Patient Access
    patientUid: { type: String, unique: true, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },

    email: { type: String, trim: true, sparse: true },
    phone: { type: String, trim: true, sparse: true },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true
    },

    weight: {
      type: Number
    },

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
