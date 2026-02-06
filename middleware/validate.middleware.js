import { ApiError } from "../utils/ApiError.js";

export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ApiError(400, "Validation error", {
          errors: error.details.map((d) => ({
            path: d.path.join("."),
            message: d.message,
          })),
        }),
      );
    }

    req.body = value;
    next();
  };
}
