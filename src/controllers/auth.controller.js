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
export const register = asyncHandler(async (req, res) => {
  // 1. Basic input validation
  requireFields(req.body, ["email", "password", "role"]);
  validateEmail(req.body.email);
  validatePassword(req.body.password);

  // 2. Delegate to service
  const user = await AuthService.registerUser(req.body);

  // 3. Response
  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

/**
 * Login user
 */

export const login = asyncHandler(async (req, res) => {
  requireFields(req.body, ["email", "password"]);

  const result = await AuthService.loginUser(req.body.email, req.body.password);

  // SET COOKIE HERE
  res.cookie("token", result.token, cookieOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, result.user, "Login successful"));
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
