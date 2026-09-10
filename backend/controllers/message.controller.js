import mongoose from "mongoose";

import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { customResponse } from "../utils/util.js";

export const sendMsgHandler = async (sender, payload) => {
  const receiver = payload.receiverId;
  const { content, content_type } = payload.message;

  if (!sender || !receiver || !content) {
    return "All fields are required."
  }

  let participants = [sender, receiver].sort();

  try {
    //----Find or Create Conversation----
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants,
      });
      await conversation.save();
    }

    //----Create a New Message----
    const newMsg = new Message({
      conversationId: conversation._id,
      sender,
      receiver,
      contentType: content_type,
      content,
    });
    await newMsg.save();

    //----Update Conversation----
    conversation.unreadCount += 1;
    conversation.lastMessage = newMsg;
    await conversation.save();

    return { newMsg, conversation };
  } catch (error) {
    console.log("sendMsgHandler Error", error.message);
    return "something went wrong.";
  }
};

export const deleteMsgHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const isDeleted = await Message.findByIdAndDelete(id);
    if (!isDeleted) return customResponse(res, 400, "unable to delete");
    return customResponse(res, 200, "deleted successfully.", {
      _id: isDeleted._id,
    }); //todo: make the ui like in the whatsapp for the successful deleted msg
  } catch (error) {
    console.log("deleteMsgHandler Error", error.message);
    return customResponse(res, 500, "Internal server error");
  }
};

export const updateMsgHandler = async (req, res) => {
  const id = mongoose.Types.ObjectId.createFromHexString(req.params.id);
  const { content } = req.body;

  if (!content || !id)
    return customResponse(res, 400, "Message cannot be empty.");

  try {
    const isUpadated = await Message.findByIdAndUpdate(
      id,
      { content },
      { new: true },
    );
    if (!isUpadated) return customResponse(res, 400, "unable to update");
    return customResponse(res, 200, "updated successfully.", isUpadated);
  } catch (error) {
    console.log("updateMsgHandler Error", error.message);
    return customResponse(res, 500, "Internal server error");
  }
};

export const getOfflineMessages = async (value) => {
  const id = mongoose.Types.ObjectId.createFromHexString(value);
  if (!id) return;

  try {
    const messages = await Message.aggregate([
      {
        $match: {
          receiver: id,
          messageStatus: "sent",
        },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $group: {
          _id: "$conversationId",
          messages: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $lookup: {
          from: "conversations",
          localField: "_id",
          foreignField: "_id",
          as: "conversationObj",
        },
      },
      {
        $unwind: "$conversationObj",
      },
      {
        $addFields: {
          otherUserId: {
            $first: {
              $filter: {
                input: "$conversationObj.participants",
                as: "p",
                cond: { $ne: ["$$p", id] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "otherUserId",
          foreignField: "_id",
          as: "otherUser",
        },
      },
      {
        $unwind: "$otherUser",
      },
      {
        $project: {
          _id: 1,
          messages: 1,
          "otherUser._id": 1,
          "otherUser.username": 1,
          "otherUser.profilePic": 1,
        },
      },
    ]);
    return messages;
  } catch (error) {
    console.log("fetchUndeliveredMessages Error", error.message);
    return [];
  }
};
