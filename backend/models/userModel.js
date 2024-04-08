const mongoose=require("mongoose");
const bcryptjs=require("bcryptjs");

const userSchema=mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        pic:{type:String,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
    },
    {timestamps:true}
)

//pre->says that before saving the user object
userSchema.pre("save",async function(next){
    // if the passowrd is modified already return
    if(!this.isModified){
        next();
    }
    //generate the salt(used for strengthen the password hashing) and hash the password
    const salt=await bcryptjs.genSalt(10);
    this.password=await bcryptjs.hash(this.password,salt);
})


//adding a method to user model for comparing stored and entered password
userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password);
}

const User=mongoose.model("User",userSchema);
module.exports=User;


// The User modal can contain the following values
// name     -> name of the user
// email    -> email of the user which is unique for each user
// password -> password which is stores in encrypted format
// pic      -> This stores the url to the user image where the user has uploaded which is stored in cludinary