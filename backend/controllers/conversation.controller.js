import Message from "../models/message.model.js";
import { customResponse } from "../utils/util.js";
import { encodeCursor, decodeCursor } from "../utils/util.js";

export const getFirstPage = async (req, res) => {
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
      .sort({ createdAt: -1, _id: -1 })
      .limit(MAX_LIMIT);

    if (messages.length === 0) {
      return customResponse(res, 200, {
        data: {
          messages: [],
          nextCursor: null,
        },
      });
    }

    const last = messages[messages.length - 1];
    const nextCursor = encodeCursor({ createdAt: last.createdAt, _id: last._id });
    
    return customResponse(res, 200, {
      data: {
        messages,
        nextCursor: messages.length === MAX_LIMIT ? nextCursor : null,
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