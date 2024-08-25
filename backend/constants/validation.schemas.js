import Joi from "joi";

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

export const verifyEmail = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validate email format
    .required(), // Make email required
  token: Joi.string()
    .min(6) // Minimum length of token (adjust as needed)
    .max(256) // Maximum length of token (adjust as needed)
    .required(), // Make token required
});

export const loginUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validate email format
    .required(), // Make email required
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

export const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validate email format
    .required(), // Make email required
});

export const changePasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validate email format
    .required(), // Make email required
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
  confirmPassword: Joi.string()
    .valid(Joi.ref("password")) // Ensure confirmPassword matches password
    .required(),
});
