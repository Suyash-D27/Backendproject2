import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import healthRecordRoutes from "./routes/healthrecord.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import testRoutes from "./routes/test.routes.js";
import historyRoutes from "./routes/history.routes.js";
import cookieParser from "cookie-parser";
import publicRoutes from "./public.routes.js";
import{errorMiddleware}from "./middlewares/error.middleware.js";

const app = express();

// Body parser
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: "*",
    credentials: true
}));

// Cookies
 app.use(cookieParser());

// -----------------------------
// 🔥 API ROUTES
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/records", healthRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/public", publicRoutes);

// -----------------------------
// ❌ GLOBAL ERROR HANDLER (MUST BE LAST)
// -----------------------------
app.use(errorMiddleware);

export default app;
