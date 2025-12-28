import  ApiError  from "../utils/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle unexpected errors
  if (!(err instanceof ApiError)) {
    console.error("UNEXPECTED ERROR:", err);
    message = "Something went wrong";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

