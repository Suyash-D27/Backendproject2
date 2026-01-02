
import express from "express";
import { createHospital, getAllHospitals, deleteHospital } from "../controllers/hospital.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { ROLES } from "../config/constants/roles.js";

const router = express.Router();

// Apply Auth Middleware globally for these routes
router.use(authMiddleware);

router.post(
    "/create",
    // requireRole(ROLES.SUPER_ADMIN), // TODO: Enable this for production
    createHospital
);

router.get(
    "/list",
    requireRole(ROLES.SUPER_ADMIN),
    getAllHospitals
);

router.delete(
    "/:id",
    requireRole(ROLES.SUPER_ADMIN),
    deleteHospital
);

export default router;
