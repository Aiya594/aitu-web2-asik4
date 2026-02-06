import Joi from "joi";

export const createBookingSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(80).required(),
  phone: Joi.string().trim().min(5).max(30).required(),
  people: Joi.number().integer().min(1).max(20).required(),
  dateTime: Joi.date().iso().required(),
  notes: Joi.string().trim().max(300).allow("").optional(),
});

export const updateBookingSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(80).optional(),
  phone: Joi.string().trim().min(5).max(30).optional(),
  people: Joi.number().integer().min(1).max(20).optional(),
  dateTime: Joi.date().iso().optional(),
  notes: Joi.string().trim().max(300).allow("").optional(),
}).min(1);
