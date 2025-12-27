import { ApiError } from "../utils/ApiError.js";

export const allowRoles = (...allowedRoles) => {
  return (req, _, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied for this role");
    }
    next();
  };
};
