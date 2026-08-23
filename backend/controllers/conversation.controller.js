import Message from "../models/message.model.js";
import { customResponse } from "../utils/util.js";

export const getAllMsgHandler = async (req, res) => {
  const { conversationId } = req.params;
  const MAX_LIMIT = 50;

  if (!conversationId)
    return customResponse(res, 400, {
      error: {
        message: "Invalid conversation id",
      },
    });

  try {
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(MAX_LIMIT);
    return customResponse(res, 200, {
      data: {
        messages,
      },
    });
  } catch (error) {
    console.log("getAllMsgHandler Error", error.message);
    return customResponse(res, 500, {
      error: {
        message: `Internal server error ${error.message}`,
      },
    });
  }
};
