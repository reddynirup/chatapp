const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

// The Message modal can contain the following values
// sender  -> Is the user who sent this message refering tp that user
// content -> This is the actual content user sent
// chat    ->To which chat does it belong to referencing to that chat