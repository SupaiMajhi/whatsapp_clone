import { Router } from "express";


import { getOtpHandler, resendHandler, verifyOtpHandler, checkAuthHandler, logoutHandler, checkVTtokenHandler } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authLimiter from "../middleware/rateLimit.js";

const router = Router();

router.post('/otp', getOtpHandler);

router.get('/otp/resend', authLimiter, resendHandler);

router.post('/otp/verify', authLimiter, verifyOtpHandler);

router.get('/logout', authMiddleware, logoutHandler);

router.get('/check-auth', authMiddleware, checkAuthHandler);

router.get('/check-vt', checkVTtokenHandler);

export default router;