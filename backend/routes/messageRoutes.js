const express=require("express");
const {protect}=require("../middleware/authMiddleware");
const {sendMessage,allMessages} =require("../controllers/messageControllers");

const router=express.Router();

router.route('/').post(protect,sendMessage);        //this route is used to send a message
router.route('/:chatId').get(protect,allMessages);  //this route is used to get all messages related to a chat

module.exports=router;