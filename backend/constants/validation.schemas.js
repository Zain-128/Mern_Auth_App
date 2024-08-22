const Joi = require("joi");

// Define the schema
export const registerUserSchema = Joi.object({
  name: Joi.string()
    .min(2) // Minimum length of 2 characters
    .max(50) // Maximum length of 50 characters
    .required() // Field is required
    .messages({
      "string.base": "Name should be a type of text",
      "string.min": "Name should have a minimum length of {#limit}",
      "string.max": "Name should have a maximum length of {#limit}",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .email() // Valid email format
    .required() // Field is required
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8) // Minimum length of 8 characters
    .max(100) // Maximum length of 100 characters
    .required() // Field is required
    .messages({
      "string.base": "Password should be a type of text",
      "string.min": "Password should have a minimum length of {#limit}",
      "string.max": "Password should have a maximum length of {#limit}",
      "any.required": "Password is required",
    }),
});
