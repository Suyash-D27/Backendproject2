import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const auth = (req, res, next) => {
  try {
    // Read token from cookie OR Authorization header
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key-123");

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      hospitalId: decoded.hospitalId || null,
      patientId: decoded.patientId || null,
      isPatientLogin: decoded.isPatientLogin || false,
    };

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return next(new ApiError(401, "Unauthorized: Invalid or expired token"));
  }
};

export default auth;
