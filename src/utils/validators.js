import ApiError from "./ApiError.js";

/**
 * Generic required fields validator
 */
export const requireFields = (body, fields = []) => {
  const missing = fields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ""
  );

  if (missing.length > 0) {
    throw new ApiError(
      400,
      `Missing required fields: ${missing.join(", ")}`
    );
  }
};

/**
 * Validate MongoDB ObjectId (basic format check)
 */
export const validateObjectId = (id, fieldName = "id") => {
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
};

/**
 * Email format validation
 */
export const validateEmail = (email) => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }
};

/**
 * Password strength validation
 */
export const validatePassword = (password) => {
  if (password.length < 6) {
    throw new ApiError(
      400,
      "Password must be at least 6 characters long"
    );
  }
};

/**
 * Aadhaar number validation (India – basic format)
 */
export const validateAadhaar = (aadhaar) => {
  if (!aadhaar.match(/^[0-9]{12}$/)) {
    throw new ApiError(400, "Invalid Aadhaar number");
  }
};

/**
 * Doctor license validation (basic)
 */
export const validateMedicalLicense = (license) => {
  if (!license || license.length < 5) {
    throw new ApiError(400, "Invalid medical license number");
  }
};

/**
 * Vitals validation
 */
export const validateVitals = (vitals) => {
  if (typeof vitals !== "object") {
    throw new ApiError(400, "Vitals must be an object");
  }

  const allowedFields = [
    "height",
    "weight",
    "bloodPressure",
    "oxygenLevel",
    "temperature",
    "pulse"
  ];

  Object.keys(vitals).forEach((key) => {
    if (!allowedFields.includes(key)) {
      throw new ApiError(400, `Invalid vitals field: ${key}`);
    }
  });
};

/**
 * Medicine input validation
 */
export const validateMedicine = (medicine) => {
  requireFields(medicine, ["name", "dosage", "frequency"]);

  if (typeof medicine.name !== "string") {
    throw new ApiError(400, "Medicine name must be a string");
  }
};

/**
 * Pagination query validation
 */
export const validatePagination = (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);

  if (page < 1 || limit < 1) {
    throw new ApiError(400, "Invalid pagination values");
  }

  return { page, limit };
};
