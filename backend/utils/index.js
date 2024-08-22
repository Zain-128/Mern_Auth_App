import jwt from "jsonwebtoken";

export const VerifcationToken = () =>
  `${parseInt(Math.random() * (999999 - 100000 + 1) + 100000)}`;

export const generateJWTToeken = async (res, id) => {
  const token = jwt.sign({ payload: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    maxAge: 7 * 24 * 24 * 60 * 1000,
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  return token;
};
