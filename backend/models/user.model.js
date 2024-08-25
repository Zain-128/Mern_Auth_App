import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now() },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiredAt: Date,
    resetTokenExpiredAt: Date,
    resetToken: String,
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
