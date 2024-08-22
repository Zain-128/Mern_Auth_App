import { registerUserSchema } from "../constants/validation.schemas.js";

export const register = async (req, res, next) => {
  try {
    const { error, value } = registerUserSchema.validate(data);

    if (error) {
      console.error("Validation error:", error.details);
    }
  } catch (error) {
    return next(error);
  }
};
