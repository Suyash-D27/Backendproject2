import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    healthRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthRecord",
      required: true,
      unique: true
    },

    doctorSignature: {
      type: String,
      trim: true
    },

    dieticianSignature: {
      type: String,
      trim: true
    },

    remarks: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
