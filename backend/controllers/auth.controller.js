import { registerUserSchema } from "../constants/validation.schemas.js";
import userModel from "../models/user.model.js";
import { generateJWTToeken, VerifcationToken } from "../utils/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/mail.service.js";
export const register = async (req, res, next) => {
  try {
    // Validate Incoming Data
    const { error, value } = registerUserSchema.validate(req.body);

    if (error) {
      console.error("Validation error:", error.details);
      throw new Error(`Error :  ${error.details.map((ele) => ele.message)} `);
    }

    const { email, password, name } = req.body;
    // Check if User already Exists
    const userAlreadyExists = await userModel.exists({ email });

    if (userAlreadyExists) {
      return next({
        status: 400,
        message: "User Already Exists ! ",
      });
    }

    // Hash Our Password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Genrating Token and Saving User  into db

    let verificationToken = VerifcationToken();
    const user = new userModel({
      email,
      name,
      password: hashedPassword,
      verificationToken: bcrypt.sign(verificationToken),
      verificationTokenExpiredAt: (Date.now + 24 * 60 * 60) & 1000,
    });

    await user.save();

    console.log(user);
    await sendEmail(user, verificationToken);
    // Genrating JWT TOKEN

    const token = await generateJWTToeken(res, user._id);

    // return the response

    return res.status(201).json({
      message: "User Created Successfully!",
      data: {
        user: {
          ...user._doc,
          password: undefined,
        },
        token,
      },
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
