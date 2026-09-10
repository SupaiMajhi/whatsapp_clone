import Message from "../models/message.model.js";
import { customResponse } from "../utils/util.js";
import { encodeCursor, decodeCursor } from "../utils/util.js";

export const getFirstPage = async (req, res) => {
  const { conversationId } = req.params;
  const MAX_LIMIT = 51;

  if (!conversationId)
    return customResponse(res, 400, {
      error: {
        message: "Invalid conversation id", //Invalid request.
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
          hasMore: false,
        },
      });
    }

    const last = messages[messages.length - 1];
    const nextCursor = encodeCursor({
      createdAt: last.createdAt,
      _id: last._id,
    });

    return customResponse(res, 200, {
      data: {
        messages: messages.slice(0, MAX_LIMIT).reverse(),
        nextCursor: messages.length === MAX_LIMIT ? nextCursor : null,
        hasMore: messages.length === MAX_LIMIT ? true : false,
      },
    });
  } catch (error) {
    console.log("getFirstPage Error", error.message);
    return customResponse(res, 500, {
      error: {
        message: `Internal server error ${error.message}`,
      },
    });
  }
};

export const getNextPage = async (req, res) => {
  const MAX_LIMIT = 51;
  const { conversationId } = req.params;
  const { cursor } = req.query;

  if (!cursor || cursor === null) return;
  if (!conversationId) {
    return customResponse(res, 400, {
      error: {
        message: "Invalid conversation id", //Invalid request
      },
    });
  }
  const { createdAt, _id } = decodeCursor(cursor);
  try {
    const messages = await Message.find({
      conversationId,
      $or: [
        { createdAt: { $lt: createdAt } },
        { createdAt, _id: { $lt: _id } },
      ],
    })
      .sort({ createdAt: -1, _id: -1 })
      .limit(MAX_LIMIT);

    if (messages.length === 0) {
      return customResponse(res, 200, {
        data: {
          messages: [],
          nextCursor: null,
          hasMore: false,
        },
      });
    }

    const last = messages[messages.length - 1];
    const nextCursor = encodeCursor({
      createdAt: last.createdAt,
      _id: last._id,
    });

    return customResponse(res, 200, {
      data: {
        messages: messages.slice(0, MAX_LIMIT).reverse(),
        nextCursor: messages.length === MAX_LIMIT ? nextCursor : null,
        hasMore: messages.length === MAX_LIMIT ? true : false,
      },
    });
  } catch (error) {
    console.log("getNextPage Error", error.message);
    return customResponse(res, 500, {
      error: {
        message: `Internal server error ${error.message}`,
      },
    });
  }
};