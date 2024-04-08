const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//this is used to  access the chat
router.route("/").get(protect, fetchChats);
//this is used to create the chat
router.route("/").post(protect, accessChat);
//this is used to create a group chat
router.route("/group").post(protect, createGroupChat);
//this is used to rename a group 
router.route("/rename").put(protect, renameGroup);

// =>adding or removing of any user can only be done by group admin
// this is used to add some one to group 
router.route("/groupadd").put(protect, addToGroup);
//this is used to remove someone from group 
router.route("/groupremove").put(protect, removeFromGroup);

module.exports = router;