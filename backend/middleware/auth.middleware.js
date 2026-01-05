import { errorResponse } from "../lib/lib.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  const { auth_token } = req.cookies;
  if (!auth_token) return errorResponse(res, 401, "Unauthorized");
  try {
    const isVerified = jwt.verify(auth_token, process.env.JWT_SECRET_KEY);
    if (!isVerified) return errorResponse(res, 401, "unauthorized");
    const user = await User.findOne({ phoneNumber: isVerified });
    if (!user) return errorResponse(res, 401, "unauthorized");
    req.user = user;
    next();
  } catch (error) {
    console.log("authMiddleware Error", error.message);
    return errorResponse(res, 500, "Internal server error");
  }
};

export default authMiddleware;
