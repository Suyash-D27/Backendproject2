import ApiError from "../utils/ApiError.js";

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // authMiddleware must run before this
    if (!req.user || !req.user.role) {
      throw new ApiError(401, "Authentication required");
    }

    // role check
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied for this role");
    }

    next();
  };
};
