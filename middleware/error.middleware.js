import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res, next) {
  next(new ApiError(404, `Not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Server error";

  const payload = { message };
  if (err instanceof ApiError && err.details !== undefined) {
    payload.details = err.details;
  }

  // Helpful during development
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}
