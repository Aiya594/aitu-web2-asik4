import Joi from "joi";

export const createBookingSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().max(120).required(),
  people: Joi.number().integer().min(1).max(20).required(),
  dateTime: Joi.date().iso().required(),
  notes: Joi.string().trim().max(300).allow("").optional(),
});

export const updateBookingSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(80).optional(),
  email: Joi.string().trim().email().max(120).optional(),
  people: Joi.number().integer().min(1).max(20).optional(),
  dateTime: Joi.date().iso().optional(),
  notes: Joi.string().trim().max(300).allow("").optional(),
}).min(1);
