import React, { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);

  // const navigate=useNavigate();

  useEffect(() => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo) {
    setUser(userInfo);
  } else {
    // Handle case where userInfo is undefined, perhaps set a default user or redirect
    // navigate("/", { replace: true });
  }
}, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  // after creating the context to access the context we make use of useContext hook 
  return useContext(ChatContext);
};

export default ChatProvider;