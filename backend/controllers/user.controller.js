import mongoose from "mongoose";

import { customResponse } from "../utils/util.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const getUserHandler = async (req, res) => {
  const { phone } = req.body.content;
  if (!phone) {
    return customResponse(res, 400, {
      error: {
        message: "Bad request",
      },
    });
  }
  try {
    const hasDocument = await User.findOne({
      $and: [{ phone: { $eq: phone } }, { phone: { $ne: req.user.phone } }],
    })?.select(["-auth_token", "-isAuthenticated", "-isProfileComplete"]);
    if (!hasDocument) {
      return customResponse(res, 200, {
        data: {
          message: `No results found for "${phone}"`,
          user: [],
        },
      });
    }
    return customResponse(res, 200, {
      data: {
        user: hasDocument,
      },
    });
  } catch (error) {
    console.log("Error in getUserHandler", error.message);
    return customResponse(res, 500, {
      error: {
        message: `Internal server error ${error.message}`,
      },
    });
  }
};

export const setUserStatus = async (id) => {
  try {
    const res = await User.findByIdAndUpdate(
      id,
      { isOnline: true },
      { new: true },
    );
    return res.isOnline;
  } catch (error) {
    console.log("setUserStatus error", error.message);
    return;
  }
};

export const getUserStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await User.findById(userId)
      .select("isOnline")
      .select("lastSeen");
    return customResponse(res, 200, "retrieve successfully.", response);
  } catch (error) {
    console.log("getUserStatus Error", error.message);
    return customResponse(res, 500, "Internal server error");
  }
};

export const getChatListHandler = async (req, res) => {
  const id = mongoose.Types.ObjectId.createFromHexString(req.user.id);
  if (!id)
    return customResponse(res, 400, {
      error: {
        message: "Can't retrieve chatlist.",
      },
    });

  try {
    const chatlist = await Conversation.aggregate([
      {
        $match: { participants: { $in: [id] } },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $addFields: {
          otherUserId: {
            $first: {
              $filter: {
                input: "$participants",
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
          unreadCount: 1,
          lastMessage: 1,
          lastMessagePreview: 1,
          createdAt: 1,
          updatedAt: 1,
          "otherUser._id": 1,
          "otherUser.username": 1,
          "otherUser.profilePic": 1,
        },
      },
    ]);
    return customResponse(res, 200, {
      message: "chatlist retrieved",
      data: {
        chatlist,
      },
    });
  } catch (error) {
    console.log("getChatListHandler Error", error.message);
    return customResponse(res, 500, {
      error: {
        message: `Internal server error ${error.message}`,
      },
    });
  }
};

export const avatarUploadHandler = async (req, res) => {
  const id = req.user.id;
  const file = req.file;
  try {
    const response = await uploadProfile(file);
    if (!response) {
      return customResponse(res, 400, "Something went wrong, please try again");
    }
    //remove the file from the server
    await fs.unlink(file.path);

    const newDoc = await User.findByIdAndUpdate(
      id,
      { profilePic: response.url },
      { new: true },
    );
    return customResponse(res, 200, {
      message: "profile uploaded successfully.",
      data: {
        profilePic: newDoc.profilePic,
      },
    });
  } catch (error) {
    console.log("avatarUploadHandler error", error.message);
    return customResponse(res, 500, "Internal server error.");
  }
};

export const updateUserHandler = async (req, res) => {
  const { username } = req.body.content;
  const id = req.user.id;
  const file = req?.file;

  if (!username)
    return customResponse(res, 400, {
      error: {
        message: "All fields are required.",
      },
    });

  try {
    /**-------FIND USER WITH ID-------*/
    const user = await User.findOne({ _id: id });
    if (!user)
      return customResponse(res, 400, {
        error: {
          message: "no user found.",
        },
      });

    /**-----USE THE CLOUDINARY API TO OBTAIN THE LINK OF PROFILE PIC-------*/
    if (file) {
      const response = await uploadProfile(file);
      if (!response) {
        return customResponse({
          error: {
            message: "Something went wrong, please try agan later",
          },
        });
      }
      user.profilePic = response?.secure_url;
      //remove file from server
      await fs.unlink(file.path);
    } else {
      user.profilePic = "";
    }

    /** ------UPDATE USER------ */
    user.username = username;
    user.isProfileComplete = true;
    await user.save();

    return customResponse(res, 201, {
      message: "profile updated successfully.",
      data: {
        isProfileComplete: user.isProfileComplete,
        profilePic: user.profilePic,
        uesrname: user.username,
      },
    });
  } catch (error) {
    console.log("Error in updateUserHandler ", error.message);
    return customResponse(res, 500, {
      error: {
        message: `Internal server error ${error.message}`,
      },
    });
  }
};
