import { AuditLog } from "../models/AuditLog.model.js";
import { ApiError } from "../utils/ApiError.js";

class AuditService {

  // 1️⃣ Generic Audit Logger
  static async logAction({
    userId,
    role,
    hospitalId,
    action,
    entityType,
    entityId,
    metadata = {},
  }) {
    if (!userId || !action || !hospitalId) {
      throw new ApiError(400, "Invalid audit log data");
    }

    const log = await AuditLog.create({
      userId,
      role,
      hospitalId,
      action,
      entityType,
      entityId,
      metadata,
      timestamp: new Date(),
    });

    return log;
  }

  // 2️⃣ Fetch Audit Logs (Admin use – later)
  static async getHospitalAuditLogs(hospitalId, filters = {}) {
    return AuditLog.find({
      hospitalId,
      ...filters,
    }).sort({ timestamp: -1 });
  }
}

export default AuditService;
