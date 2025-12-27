import { ApiError } from "../utils/ApiError.js";

/**
 * Generic hospital scope middleware
 * @param {Function} getResourceHospitalId - function that returns hospitalId from request
 */
export const hospitalScope = (getResourceHospitalId) => {
  return (req, res, next) => {
    if (!req.user || !req.user.hospitalId) {
      throw new ApiError(401, "Authentication required");
    }

    const resourceHospitalId = getResourceHospitalId(req);

    if (!resourceHospitalId) {
      throw new ApiError(400, "Unable to determine hospital scope");
    }

    if (resourceHospitalId.toString() !== req.user.hospitalId.toString()) {
      throw new ApiError(403, "Cross-hospital access denied");
    }

    next();
  };
};
