import { Router } from "express";


import { getOtpHandler, resendHandler, verifyOtpHandler, checkAuthHandler, avatarUploadHandler, logoutHandler, checkVTtokenHandler } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authLimiter from "../middleware/rateLimit.js";
import upload from "../services/multer.js";

const router = Router();

router.post('/otp/get-otp', getOtpHandler);

router.get('/otp/re-send', authLimiter, resendHandler);

router.post('/otp/verify', authLimiter, verifyOtpHandler);

router.get('/logout', authMiddleware, logoutHandler);

router.get('/check-auth', authMiddleware, checkAuthHandler);

router.get('/check-vt', checkVTtokenHandler);

router.post('/upload-profile', authMiddleware, upload.single('avatar'), avatarUploadHandler);

export default router;