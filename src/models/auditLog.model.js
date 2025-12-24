import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR", "LAB_ADMIN", "HOSPITAL_ADMIN"],
      required: true
    },

    action: {
      type: String,
      required: true,
      trim: true
      // e.g. "CREATED_HEALTH_RECORD", "UPLOADED_TEST_REPORT"
    },

    entityType: {
      type: String,
      trim: true
      // e.g. "HealthRecord", "TestReport", "Prescription"
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId
      // ID of the affected record
    },

    ipAddress: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
