import express from "express";
import {
  orderTest,
  updateTestStatus,
  uploadTestReport,
  getTestReport
} from "../controllers/test.controller.js";

import auth from "../middlewares/auth.middleware.js";
import verified from "../middlewares/verified.middleware.js";
import hospitalScope from "../middlewares/hospitalScope.middleware.js";

const router = express.Router();

router.post("/", auth, verified, hospitalScope, orderTest);
router.patch("/:testId/status", auth, verified, hospitalScope, updateTestStatus);
router.patch("/:testId/report", auth, verified, hospitalScope, uploadTestReport);
router.get("/:testId/report", auth, verified, hospitalScope, getTestReport);

export default router;
    