import { Router } from "express";
import { getFirstPage } from "../controllers/conversation.controller.js";

const router = Router();

router.get('/:conversationId/messages', getFirstPage);

export default router;