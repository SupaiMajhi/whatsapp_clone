import { Router } from "express";

import { getAllUsersHandler, getUserStatus, createUserHandler } from '../controllers/user.controller.js';
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post('/create', createUserHandler)

router.get('/get-all-users', authMiddleware, getAllUsersHandler);

router.get('/get-status/:userId', authMiddleware, getUserStatus)

export default router;