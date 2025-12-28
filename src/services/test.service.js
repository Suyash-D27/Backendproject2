import  Test  from "../models/Test.model.js";
import  HealthRecord from "../models/HealthRecord.model.js";
import  ApiError from "../utils/ApiError.js";
import {
  ROLES,
} from "../config/constants/roles.js";
import{ TEST_STATUS } from "../config/constants/testStatus.js";
import { HEALTH_RECORD_STATUS } from "../config/constants/healthRecordStatus.js";

class TestService {

  // 1️⃣ Order Test (Doctor only)
  static async orderTest(healthRecordId, testData, currentUser) {
    // Doctor only
    if (currentUser.role !== ROLES.DOCTOR) {
      throw new ApiError(403, "Only doctor can order tests");
    }

    if (!currentUser.isVerified) {
      throw new ApiError(403, "Doctor verification required");
    }

    const record = await HealthRecord.findById(healthRecordId);

    if (!record) {
      throw new ApiError(404, "Health record not found");
    }

    if (record.status === HEALTH_RECORD_STATUS.FINALIZED) {
      throw new ApiError(400, "Cannot order test after record finalization");
    }

    if (!record.diagnosis) {
      throw new ApiError(400, "Diagnosis required before ordering tests");
    }

    // Hospital isolation
    if (record.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Hospital access violation");
    }

    // Create test
    const test = await Test.create({
      healthRecordId,
      patientId: record.patientId,
      doctorId: currentUser.userId,
      hospitalId: record.hospitalId,
      testName: testData.testName,
      instructions: testData.instructions,
      status: TEST_STATUS.ORDERED,
    });

    return test;
  }

  // 2️⃣ Update Test Status (Lab Admin)
  static async updateTestStatus(testId, status, currentUser) {
    if (currentUser.role !== ROLES.LAB_ADMIN) {
      throw new ApiError(403, "Only lab admin can update test status");
    }

    const test = await Test.findById(testId);

    if (!test) {
      throw new ApiError(404, "Test not found");
    }

    // Hospital isolation
    if (test.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Hospital access violation");
    }

    // State machine enforcement
    const allowedTransitions = {
      [TEST_STATUS.ORDERED]: [TEST_STATUS.SAMPLE_COLLECTED],
      [TEST_STATUS.SAMPLE_COLLECTED]: [TEST_STATUS.REPORT_UPLOADED],
    };

    if (!allowedTransitions[test.status]?.includes(status)) {
      throw new ApiError(400, "Invalid test status transition");
    }

    test.status = status;
    await test.save();

    return test;
  }

  // 3️⃣ Upload Test Report (Lab Admin)
  static async uploadTestReport(testId, reportData, currentUser) {
    if (currentUser.role !== ROLES.LAB_ADMIN) {
      throw new ApiError(403, "Only lab admin can upload reports");
    }

    const test = await Test.findById(testId);

    if (!test) {
      throw new ApiError(404, "Test not found");
    }

    if (test.status !== TEST_STATUS.SAMPLE_COLLECTED) {
      throw new ApiError(400, "Report can be uploaded only after sample collection");
    }

    // Hospital isolation
    if (test.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Hospital access violation");
    }

    test.report = {
      fileUrl: reportData.fileUrl,
      summary: reportData.summary,
      uploadedAt: new Date(),
    };

    test.status = TEST_STATUS.REPORT_UPLOADED;
    await test.save();

    return test;
  }

  // 4️⃣ Get Test Report (Doctor / Patient)
  static async getTestReport(testId, currentUser) {
    const test = await Test.findById(testId);

    if (!test) {
      throw new ApiError(404, "Test not found");
    }

    if (test.status !== TEST_STATUS.REPORT_UPLOADED) {
      throw new ApiError(403, "Test report not available yet");
    }

    // Hospital isolation
    if (test.hospitalId.toString() !== currentUser.hospitalId) {
      throw new ApiError(403, "Hospital access violation");
    }

    // Patient can view only own report
    if (
      currentUser.role === ROLES.PATIENT &&
      test.patientId.toString() !== currentUser.userId
    ) {
      throw new ApiError(403, "Access denied");
    }

    return test.report;
  }
}

export default TestService;
