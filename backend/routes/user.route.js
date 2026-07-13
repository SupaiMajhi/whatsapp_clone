import { Router } from "express";

import {
  getUserStatus,
  getChatListHandler,
  getUserHandler,
  avatarUploadHandler,
  updateUserHandler
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../services/multer.js";

const router = Router();

router.get("/status/:userId", authMiddleware, getUserStatus);

//search specific user
router.post("/search", authMiddleware, getUserHandler);

//get prev chat list
router.get("/chatlist", authMiddleware, getChatListHandler);

router.patch(
  "/upload-profile",
  authMiddleware,
  upload.single("avatar"),
  avatarUploadHandler,
);

router.patch(
  "/update",
  authMiddleware,
  upload.single("profilePic"),
  updateUserHandler,
);

export default router;