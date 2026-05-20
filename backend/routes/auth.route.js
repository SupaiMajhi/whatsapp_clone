import { Router } from "express";


import { getOtpHandler, resendHandler, verifyOtpHandler, checkAuthHandler, avatarUploadHandler, logoutHandler, checkVTtokenHandler, updateUserHandler } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authLimiter from "../middleware/rateLimit.js";
import upload from "../services/multer.js";

const router = Router();

router.post('/otp', getOtpHandler);

router.get('/otp/resend', authLimiter, resendHandler);

router.post('/otp/verify', authLimiter, verifyOtpHandler);

router.get('/logout', authMiddleware, logoutHandler);

router.get('/check-auth', authMiddleware, checkAuthHandler);

router.get('/check-vt', checkVTtokenHandler);

//move this route to user.route.js
router.patch('/upload-profile', authMiddleware, upload.single('avatar'), avatarUploadHandler);

router.patch('/update', authMiddleware, upload.single('profilePic'), updateUserHandler)

export default router;