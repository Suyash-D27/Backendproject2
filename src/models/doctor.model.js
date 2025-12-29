import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },

    specialization: {
      type: String,
      required: true,
      trim: true
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true
    },

    isLicenseVerified: {
      type: Boolean,
      default: false
    },

    experienceYears: {
      type: Number,
      default: 0
    },

    consultationFee: {
      type: Number
    },

    licenseFileUrl: { type: String, default: null },


    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
