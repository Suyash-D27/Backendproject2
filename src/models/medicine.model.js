import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    dosage: {
      type: String,
      trim: true
      // e.g. "500 mg", "10 ml"
    },

    beforeAfterFood: {
      type: String,
      enum: ["BEFORE", "AFTER"],
      required: true
    },

    schedule: {
      morning: {
        type: Boolean,
        default: false
      },
      afternoon: {
        type: Boolean,
        default: false
      },
      evening: {
        type: Boolean,
        default: false
      },
      night: {
        type: Boolean,
        default: false
      }
    },

    durationDays: {
      type: Number,
      required: true
    },

    instructions: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
