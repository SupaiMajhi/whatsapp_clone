import { Router } from "express";
import { getFirstPage, getNextPage } from "../controllers/conversation.controller.js";

const router = Router();

router.get('/:conversationId/messages', getFirstPage);

router.get('/:conversationId/messages/more', getNextPage);

export default router;