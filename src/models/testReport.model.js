import mongoose from "mongoose";

const testReportSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      unique: true
    },

    resultSummary: {
      type: String,
      trim: true
    },

    reportFile: {
      type: String
      // File path or cloud URL
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",    // must be LAB Admin  
      required: true
    }
  },
  {
    timestamps: true
  }
);

const TestReport = mongoose.model("TestReport", testReportSchema);

export default TestReport;
