//libraries
const express=require("express");
const cors = require('cors');
const dotenv=require("dotenv");
const path=require("path");

//function for conneting to mongodb
const connetDB=require("./config/db");
//routes
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes");
//error handlers
const { notFound, errorHandler }=require("./middleware/errorMiddleware");


dotenv.config();
connetDB();
const app=express();
app.use(express.json());
app.use(cors());

app.use("/api/user",userRoutes);       //this is an end point related to user
app.use("/api/chat",chatRoutes);       //this is an end point related to chats
app.use("/api/message",messageRoutes); //this is an end point related to messages

//-----------------deployment---------------------
const __dirname1=path.resolve();
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname1,'/frontend/build')))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    })
}
else{
    app.get("/",(req,res)=>{
        res.send("API is running successfully..");
    })
}


//-----------------deployment---------------------

 
app.use(notFound);
app.use(errorHandler);

const PORT=process.env.PORT || 5000;
const server=app.listen(PORT,()=>{
    console.log(`server has started on port http://localhost:${PORT}`);
});

const io=require("socket.io")(server,{
    pingTimeout:60000,  //the amount of time it will wait before closing the connection to save the band width here 60000 milli sec i.e 60 sec
    cors:{
        origin:"http://localhost:3000",
    }
});

io.on("connection",(socket)=>{
    console.log("connected to socket socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User Joined Room:"+room);
    })

    socket.on('typing',(room)=>{
        socket.in(room).emit("typing");
    })

    socket.on('stop typing',(room)=>{
        socket.in(room).emit("stop typing");
    })

    socket.on("new message",(newMessageReceived)=>{
        var chat=newMessageReceived.chat;
        if(!chat.users){
            return console.log("chat.users not defined");
        }
        chat.users.forEach(user => {
            if(user._id===newMessageReceived.sender._id)return;
            socket.in(user._id).emit("message received",newMessageReceived);
        });
    })

    socket.off("setup",()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
})