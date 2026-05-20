import { Router } from "express";

import { getAllUsersHandler, getUserStatus, getChatListHandler  } from '../controllers/user.controller.js';
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../services/multer.js";

const router = Router();

router.get('/get-all-users', authMiddleware, getAllUsersHandler);

router.get('/get-status/:userId', authMiddleware, getUserStatus)

//get all prev chat list
router.get("/chatList", authMiddleware, getChatListHandler);



export default router;