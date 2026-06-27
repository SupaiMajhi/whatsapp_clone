import { Router } from "express";

import { getAllUsersHandler, getUserStatus, getChatListHandler, getUserHandler  } from '../controllers/user.controller.js';
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get('/get-all-users', authMiddleware, getAllUsersHandler);

router.get('/get-status/:userId', authMiddleware, getUserStatus);

//search specific user
router.post("/search", authMiddleware, getUserHandler);

//get all prev chat list
router.get("/chatList", authMiddleware, getChatListHandler);



export default router;
