import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  requireFields,
  validateEmail,
  validatePassword
} from "../utils/validators.js";
import { cookieOptions } from "../config/cookieOptions.js";

import AuthService from "../services/auth.service.js";

/**
 * Register user (Patient / Doctor / Admin)
 */
// -----------------------------------------------------------------------------
export const register = asyncHandler(async (req, res) => {
  // 1. Basic input validation
  const { email, phone, password } = req.body;

  if (!email && !phone) {
    throw new ApiError(400, "Email or Phone is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // 2. Delegate to service
  const user = await AuthService.registerUser(req.body);

  // 3. Response
  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

// -----------------------------------------------------------------------------
export const login = asyncHandler(async (req, res) => {
  const { identifier, email, phone, password } = req.body;

  // Allow user to send "email" or "phone" or "identifier" field
  const loginId = identifier || email || phone;

  if (!loginId || !password) {
    throw new ApiError(400, "Identifier (Email/Phone/ID) and Password required");
  }

  const result = await AuthService.loginUser(loginId, password);

  // SET COOKIE HERE
  res.cookie("token", result.token, cookieOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, { user: result.user, token: result.token }, "Login successful"));
});


/**
 * Get current logged-in user
 */
export const getMe = asyncHandler(async (req, res) => {
  // req.user is injected by auth middleware
  const user = await AuthService.getCurrentUser(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw new ApiError(400, "Profile image is required");

  const uploaded = await uploadToCloudinary(file.buffer, "profile_images");

  const updatedUser = await AuthService.updateProfileImage({
    userId: req.user.userId,
    profileImageUrl: uploaded.secure_url,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile photo updated"));
});
