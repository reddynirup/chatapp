import React from 'react';
import {ChatState} from "../Context/ChatProvider";
import {Box} from "@chakra-ui/react"; 
import SideDrawer from '../components/miscellaneous/SideDrawer';
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const  ChatPage=() =>{

  const {user}= ChatState(); //getting the user details
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate=useNavigate();
  if(!user){
    navigate("/");
  }
  
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box display="flex" justifyContent="space-between" width="100%" height="91.5vh" padding="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
};

export default ChatPage
