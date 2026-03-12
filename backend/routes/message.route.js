import { Router } from "express";
import {
  sendMsgHandler,
  deleteMsgHandler,
  updateMsgHandler,
  getAllMsgHandler,
  // devGetOfflineMessages,
} from "../controllers/message.controller.js";
import upload from "../services/multer.js";
import validateFileType from "../middleware/validateFileTypes.middleware.js";

const router = Router();
//send message
router.post("/send/:receiverId",
    upload.single("media"), validateFileType,
    sendMsgHandler
);

//delete message
router.delete("/delete-message/:id", deleteMsgHandler);

//update message
router.patch("/update-message/:id", updateMsgHandler);

//get all messages
router.get("/messages/:convoId", getAllMsgHandler);

// router.get("/offline/messages", devGetOfflineMessages);

export default router;
