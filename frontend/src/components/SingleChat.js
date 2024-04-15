import React, { useEffect } from 'react'
import Lottie from 'react-lottie';
import { ChatState } from '../Context/ChatProvider';
import {Box,Text} from "@chakra-ui/layout";
import {IconButton} from "@chakra-ui/button";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {getSender,getSenderFull} from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useState } from 'react';
import {useToast,Spinner,FormControl,Input} from "@chakra-ui/react";
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import animationData from "../animations/typing.json";
import io from "socket.io-client";

const ENDPOINT="https://talk-a-tive-rpxh.onrender.com/";
var socket,selectedChatCompare;

const SingleChat=({fetchAgain,setFetchAgain})=> {
    const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();

    const defaultOptions={
        loop:true,
        autoPlay:true,
        animationData:animationData,
        rendererSettings:{
            preserveAspectRatio:"xMidYMid slice"
        }
    }

    useEffect(()=>{
        const user1=JSON.parse(localStorage.getItem("userInfo"));
        socket=io(ENDPOINT);
        socket.emit("setup",user1);
        socket.on('connected',()=>{
            setSocketConnected(true);
        })
        socket.on("typing",()=>{
            setIsTyping(true);
        })
        socket.on("stop typing",()=>{
            setIsTyping(false);
        })
    },[])

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                method:"GET",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const response = await fetch(`/api/message/${selectedChat._id}`,config);
            const data=await response.json();
            // console.log(data);
            setMessages(data);
            setLoading(false);

              socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(()=>{
        socket.on("message received",(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id!==newMessageRecieved.chat._id){
                // give notification
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else{
                setMessages([...messages,newMessageRecieved]);
            }
        });
    })

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const requestData = {
                    content: newMessage,
                    chatId: selectedChat._id
                };

                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify(requestData)
                };

                setNewMessage("");
                const response = await fetch("/api/message",config);
                const data=await response.json();
                // console.log(data);
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                title: "Error Occured!",
                description: "Failed to send the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                });
            }
        }
    };

    

    const typingHandler=(e)=>{
        setNewMessage(e.target.value);

        // typing indicator logic
        if(!socketConnected){
            return;
        }
        if(!typing){
            setTyping(true);
            socket.emit("typing",selectedChat._id);
        }
        let lastTypingTime=new Date().getTime();
        var timmerLength=3000;
        setTimeout(()=>{
            var timeNow=new Date().getTime();
            var timeDiff=timeNow-lastTypingTime;
            if(timeDiff>=timmerLength && typing){
                socket.emit("stop typing",selectedChat._id);
                setTyping(false);
            }
        },timmerLength);
    }

    useEffect(()=>{
        fetchMessages();
        selectedChatCompare=selectedChat;
    },[selectedChat]);
    
    // console.log(notification);

    

  return <>
    {
        selectedChat?(
            <>
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    width="100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                    />
                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal
                                 user={getSenderFull(user, selectedChat.users)}
                            />
                        </>
                        
                    ) : (
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal
                                fetchMessages={fetchMessages}
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                            />
                        </>
                    )}
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    padding={3}
                    background="#E8E8E8"
                    width="100%"
                    height="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                >
                    {loading ?(
                        <Spinner size="xl" width={20} height={20} alignSelf="center" margin="auto"/> 
                    ):(
                        <div className='messages'>
                            <ScrollableChat messages={messages} />
                        </div>
                    )}
                </Box>
                <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
                    {istyping ? <div>
                        <Lottie 
                          options={defaultOptions}
                          width={70}
                          style={{marginBottom:15,marginLeft:0}}
                        />
                    </div>:<></> }
                    <Input variant="filled" background="#E0E0E0" placeholder='Enter a message...' onChange={typingHandler} value={newMessage}/>
                </FormControl>
            </>
        ):(
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
            </Box>
        )
    }
  </>
}

export default SingleChat;
