import { Router } from "express";
import { getAllUsersHandler, getUserStatus } from '../controllers/user.controller.js';

const router = Router();

router.get('/get-all-users', getAllUsersHandler);

router.get('/get-status/:userId', getUserStatus)

export default router;