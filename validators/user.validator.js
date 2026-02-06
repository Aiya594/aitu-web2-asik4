import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  password: Joi.string().min(6).max(128).optional(),
}).min(1);
