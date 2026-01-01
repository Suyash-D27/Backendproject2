import { Router } from "express";
import publicController from "../controllers/public.controller.js";

const router = Router();

router.get("/doctors", publicController.searchDoctors);
router.get("/doctors/:id", publicController.doctorPublic);

router.get("/hospitals", publicController.searchHospitals);
router.get("/hospitals/:id", publicController.hospitalPublic);

export default router;