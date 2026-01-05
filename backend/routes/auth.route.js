import { Router } from "express";
import { sendOtpHandler, verifyOtpHandler, loginHandler, signupHandler, checkAuthHandler, avatarUploadHandler, logoutHandler } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../services/multer.js";

const router = Router();

router.post('/login', loginHandler);

router.post('/otp/send-otp', sendOtpHandler);

router.post('/otp/verify', verifyOtpHandler);

router.get('/logout', authMiddleware, logoutHandler);

router.get('/check-auth', authMiddleware, checkAuthHandler);

router.post('/upload-profile', authMiddleware, upload.single('avatar'), avatarUploadHandler);

export default router;