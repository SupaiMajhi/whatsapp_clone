import { Router } from "express";
import { getAllMsgHandler } from "../controllers/conversation.controller.js";

const router = Router();

router.get('/:conversationId/messages', getAllMsgHandler);

export default router;