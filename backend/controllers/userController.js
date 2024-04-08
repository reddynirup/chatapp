const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User=require("../models/userModel");


//END POINT FOR USER REGISTRATION
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  //is any of the feilds is not present then return error
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  //checking is any user already exits with this email
  const userExists = await User.findOne({ email });

  //if user already exists then return error
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  
  // else create a new user in the database and returns the newly created document in database that is with id
  const user = await User.create({name,email,password,pic,});

  // IF THE  OPRATION IS SUCCESSFUL THEN IT RETURN THE USER DATA AND ALSO GENERATING A JWT TOKEN FOR AUTHENTIATION PURPOSE
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    //if any error occured then THROW IT
    res.status(400);
    throw new Error("User not found");
  }
});


// END POINT FOR USER LOGIN
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check if user exists
  const user = await User.findOne({ email });

  // is user exists and the passord matches then return the users data
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    // else return invalid details
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});


// API FOR GETTING ALL USER DATA BASED ON search query and return the data
// format /api/user?search=nirup  
const allUsers=asyncHandler(async (req,res)=>{
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
})

module.exports = { registerUser ,authUser,allUsers};