import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true
    },

    address: {
      type: String,
      required: true
    },

    contactNumber: {
      type: String
    },

    email: {
      type: String,
      lowercase: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
