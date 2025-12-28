import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  requireFields,
  validateObjectId
} from "../utils/validators.js";

import TestService from "../services/test.service.js";

/**
 * Order diagnostic test
 * (Doctor only – enforced in service)
 */
export const orderTest = asyncHandler(async (req, res) => {
  requireFields(req.body, ["healthRecordId", "testName"]);
  validateObjectId(req.body.healthRecordId, "healthRecordId");

  const test = await TestService.orderTest({
    healthRecordId: req.body.healthRecordId,
    testName: req.body.testName,
    user: req.user
  });

  return res
    .status(201)
    .json(new ApiResponse(201, test, "Test ordered successfully"));
});

/**
 * Update test status
 * (Lab flow)
 */
export const updateTestStatus = asyncHandler(async (req, res) => {
  validateObjectId(req.params.testId, "testId");
  requireFields(req.body, ["status"]);

  const test = await TestService.updateTestStatus({
    testId: req.params.testId,
    status: req.body.status,
    user: req.user
  });

  return res
    .status(200)
    .json(new ApiResponse(200, test, "Test status updated"));
});

/**
 * Upload test report
 * (Lab admin only – enforced in service)
 */
export const uploadTestReport = asyncHandler(async (req, res) => {
  validateObjectId(req.params.testId, "testId");
  requireFields(req.body, ["reportUrl"]);

  const test = await TestService.uploadTestReport({
    testId: req.params.testId,
    reportUrl: req.body.reportUrl,
    user: req.user
  });

  return res
    .status(200)
    .json(new ApiResponse(200, test, "Test report uploaded"));
});

/**
 * Get test report
 */
export const getTestReport = asyncHandler(async (req, res) => {
  validateObjectId(req.params.testId, "testId");

  const report = await TestService.getTestReport({
    testId: req.params.testId,
    user: req.user
  });

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Test report fetched"));
});
