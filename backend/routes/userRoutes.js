const express=require("express");
const {registerUser,authUser,allUsers}=require("../controllers/userController");
const {protect} =require("../middleware/authMiddleware");

const router=express.Router();

//this end point used for registration
//and also for getting all users details for chatting
router.route("/").post(registerUser).get(protect,allUsers);

//this end point is for logging the user
router.post("/login",authUser);

module.exports=router;