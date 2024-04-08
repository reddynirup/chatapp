const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;

// The chat modal can contain the following values
// chatName      -> If it is a group chat then there is a name if not we will give a default name same for all one to one chat
// isGroupChat   -> Used to identify if the chat is group chat or not 
// users         -> Used to store an array of user ids who belong to this chat 
// latestMessage -> Used to store the latest message id of this chat
// groupAdmin    -> This field will store the id of the user who is the group admin if it is a group chat