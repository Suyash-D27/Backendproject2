import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const authMiddleware = async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(decoded.userId).select(
    "_id role hospitalId"
  );

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  // 🔑 Attach context for services
  req.user = {
    userId: user._id,
    role: user.role,
    hospitalId: user.hospitalId,
  };

  next();
};
