import { Router } from "express";
import {
  deleteMsgHandler,
  updateMsgHandler,
} from "../controllers/message.controller.js";
import upload from "../services/multer.js";
import validateFileType from "../middleware/validateFileTypes.middleware.js";

const router = Router();

//delete message
router.delete("/delete-message/:id", deleteMsgHandler);

//update message
router.patch("/update-message/:id", updateMsgHandler);

// router.get("/offline/messages", devGetOfflineMessages);

export default router;
