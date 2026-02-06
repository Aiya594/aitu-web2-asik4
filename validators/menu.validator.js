import Joi from "joi";

export const createMenuSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  description: Joi.string().trim().allow("").max(500),
  price: Joi.number().min(0).required(),
  category: Joi.string().trim().max(40).default("other"),
  imageUrl: Joi.string().uri().allow(""),
  isAvailable: Joi.boolean().default(true),
});

export const updateMenuSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  description: Joi.string().trim().allow("").max(500),
  price: Joi.number().min(0),
  category: Joi.string().trim().max(40),
  imageUrl: Joi.string().uri().allow(""),
  isAvailable: Joi.boolean(),
}).min(1);
