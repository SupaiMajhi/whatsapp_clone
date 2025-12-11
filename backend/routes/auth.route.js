import { Router } from "express";
import { sendOtpHandler, loginHandler, signupHandler, checkAuthHandler, avatarUploadHandler, logoutHandler } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../multer.js";

const router = Router();

router.post('/send-otp', sendOtpHandler);

router.post('/login', loginHandler);

router.post('/signup', signupHandler);

router.get('/logout', authMiddleware, logoutHandler);

router.get('/check-auth', authMiddleware, checkAuthHandler);

router.post('/upload-profile', authMiddleware, upload.single('avatar'), avatarUploadHandler);

export default router;