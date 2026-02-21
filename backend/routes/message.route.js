import { Router } from "express";
import {
  sendMsgHandler,
  deleteMsgHandler,
  updateMsgHandler,
  getAllMsgHandler,
  getChatListHandler,
} from "../controllers/message.controller.js";
import upload from "../services/multer.js";
import validateFileType from "../middleware/validateFileTypes.middleware.js";

const router = Router();
//send message
router.post(
  "/send-message/:receiverId",
  upload.single("media"), validateFileType,
  sendMsgHandler
);

//delete message
router.delete("/delete-message/:id", deleteMsgHandler);

//update message
router.patch("/update-message/:id", updateMsgHandler);

//get all messages
router.get("/get-all-message/:convoId", getAllMsgHandler);

//get all prev message as chat list
router.get("/get-chatList", getChatListHandler);

export default router;
