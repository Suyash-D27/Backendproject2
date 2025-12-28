import  ApiError  from "../utils/ApiError.js";

 const requireVerifiedUser = (req, res, next) => {
  // authMiddleware must run before this
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  if (!req.user.isVerified) {
    throw new ApiError(403, "User verification required");
  }

  next();
};

export default requireVerifiedUser;