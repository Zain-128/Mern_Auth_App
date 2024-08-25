import {
  changePasswordSchema,
  loginUserSchema,
  registerUserSchema,
  verifyEmail,
} from "../constants/validation.schemas.js";
import userModel from "../models/user.model.js";
import { generateJWTToeken, VerifcationToken } from "../utils/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
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
    const hashedVerificationToken = await bcrypt.hash(verificationToken, 10);
    const user = new userModel({
      email,
      name,
      password: hashedPassword,
      verificationToken: hashedVerificationToken,
      verificationTokenExpiredAt: Date.now(),
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

export const VerifyUser = async (req, res, next) => {
  try {
    const { error, value } = verifyEmail.validate(req.body);

    if (error) {
      console.error("Validation error:", error.details);
      throw new Error(`Error :  ${error.details.map((ele) => ele.message)} `);
    }

    const { email, token } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return next({
        status: 400,
        message: "User Not Found ! ",
      });
    }

    const isTokenOkay = await bcrypt.compare(token, user.verificationToken);

    console.log("yjsisisiisis", isTokenOkay);
    if (!isTokenOkay) {
      return next({
        status: 403,
        message: "otp does not Exists ! ",
      });
    }

    let hours = moment().diff(moment(user.verificationTokenExpiredAt), "hours");

    if (hours >= 24) {
      user.verificationToken = undefined;
      user.verificationTokenExpiredAt = undefined;
      await user.save();
      return next({
        status: 403,
        message: "OTP Expired !",
      });
    }

    user.verificationToken = undefined;
    user.verificationTokenExpiredAt = undefined;
    user.isVerified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User Verified Successfully!",
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { error, value } = loginUserSchema.validate(req.body);

    if (error) {
      console.error("Validation error:", error.details);
      throw new Error(`Error :  ${error.details.map((ele) => ele.message)} `);
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return next({
        status: 400,
        message: "User Not Found ! ",
      });
    }

    const isPasswordOkay = await bcrypt.compare(password, user.password);

    if (!isPasswordOkay) {
      return next({
        status: 403,
        message: "Invalid Creadentials !",
      });
    }

    const token = await generateJWTToeken(res, user._id);

    res.cookie("auth_token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User Logged in Successfully!",
      data: {
        user: { ...user._doc, password: undefined },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("auth_token", "", {
      maxAge: 1,
    });
    return res.status(200).json({
      success: true,
      message: "User Logged Out Successfully!",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
export const forgetPassword = async (req, res, next) => {
  try {
    const { error, value } = loginUserSchema.validate(req.body);

    if (error) {
      console.error("Validation error:", error.details);
      throw new Error(`Error :  ${error.details.map((ele) => ele.message)} `);
    }

    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return next({
        status: 400,
        message: "User Not Found ! ",
      });
    }

    const token = await VerifcationToken();

    await sendEmail(user, token);

    user.resetToken = token;
    user.resetTokenExpiredAt = Date.now();

    return res.status(200).json({
      success: true,
      message: "Email Send Successfully !",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
export const verifyForgetPassword = async (req, res, next) => {
  try {
    const { error, value } = verifyEmail.validate(req.body);

    if (error) {
      console.error("Validation error:", error.details);
      throw new Error(`Error :  ${error.details.map((ele) => ele.message)} `);
    }

    const { email, token } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return next({
        status: 400,
        message: "User Not Found ! ",
      });
    }

    const isTokenOkay = await bcrypt.compare(token, user.resetToken);

    console.log("yjsisisiisis", isTokenOkay);
    if (!isTokenOkay) {
      return next({
        status: 403,
        message: "otp does not Exists ! ",
      });
    }

    let hours = moment().diff(moment(user.resetTokenExpiredAt), "hours");

    if (hours >= 24) {
      user.resetToken = undefined;
      user.resetTokenExpiredAt = undefined;
      await user.save();
      return next({
        status: 403,
        message: "OTP Expired !",
      });
    }

    user.resetToken = undefined;
    user.resetTokenExpiredAt = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Change Your Password!",
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);

    if (error) {
      console.error("Validation error:", error.details);
      throw new Error(`Error :  ${error.details.map((ele) => ele.message)} `);
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return next({
        status: 400,
        message: "User Not Found ! ",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Your Password Changed Successfully !",
    });
  } catch (err) {
    next(err);
  }
};
