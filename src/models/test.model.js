import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    healthRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthRecord",
      required: true
    },

    testName: {
      type: String,
      required: true,
      trim: true
    },

    instructions: {
      type: String,
      trim: true
      // e.g. "Fasting required", "Morning sample"
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING"
    }
  },
  {
    timestamps: true
  }
);

const Test = mongoose.model("Test", testSchema);

export default Test;
