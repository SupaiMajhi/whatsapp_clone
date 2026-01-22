import { Router } from "express";


import { sendOtpHandler, resendHandler, verifyOtpHandler, checkAuthHandler, avatarUploadHandler, logoutHandler } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authLimiter from "../middleware/rateLimit.js";
import upload from "../services/multer.js";

const router = Router();

router.post('/otp/send-otp', sendOtpHandler);

router.get('/otp/re-send', authLimiter, resendHandler);

router.post('/otp/verify', authLimiter, verifyOtpHandler);

router.get('/logout', authMiddleware, logoutHandler);

router.get('/check-auth', authMiddleware, checkAuthHandler);

router.post('/upload-profile', authMiddleware, upload.single('avatar'), avatarUploadHandler);

export default router;