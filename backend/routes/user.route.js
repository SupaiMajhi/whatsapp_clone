import { Router } from "express";
import { getAllUsersHandler, getUserStatus, createUserHandler } from '../controllers/user.controller.js';

const router = Router();

router.post('/create/user', createUserHandler)

router.get('/get-all-users', getAllUsersHandler);

router.get('/get-status/:userId', getUserStatus)

export default router;