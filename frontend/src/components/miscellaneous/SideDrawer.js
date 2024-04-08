import { Box, Button, Tooltip ,Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Input, useToast} from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React from 'react'
import { useState } from 'react';
import {ChatState} from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import UserListItem from '../UserAvatar/UserListItem';
import { useNavigate } from "react-router-dom";
import {getSender} from "../../config/ChatLogics";
import {Effect} from "react-notification-badge";
import NotificationBadge from "react-notification-badge";

const SideDrawer=()=> {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {user,setSelectedChat,chats,setChats,notification,setNotification}= ChatState();
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate=useNavigate();
  const toast=useToast();
  

  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    navigate("/",{replace:true});
  }

  const handleSearch=async ()=>{
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const options = {
        method: 'GET',
        headers: {
          Authorization:`Bearer ${user.token}`,
        }
      };
      const response = await fetch(`/api/user?search=${search}`,options);
      const data=await response.json();

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    // console.log(userId);

    try {
      setLoadingChat(true);
      const options = {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
              userId: userId
          })
      };
      const response= await fetch(`/api/chat`,options);
      const data=await response.json();

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  

  return <>
  <Box  display="flex"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="white"
        width="100%"
        padding="5px 10px 5px 10px"
        borderWidth="5px"
    >
    <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
    </Tooltip>
    <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
    </Text>
    <div>
      <Menu>
        <MenuButton padding={1}>
          <NotificationBadge count={notification.length} effect={Effect.SCALE}/>
          <BellIcon fontSize="2xl" margin={1} />
        </MenuButton>
        <MenuList pl={2}>
          {/* to shows notifications list */}
          {!notification.length && "No new messages"}
          {notification.map(notif => (
            <MenuItem key={notif._id} onClick={() => {
              setSelectedChat(notif.chat);
              setNotification(notification.filter((n) => n !== notif));
            }}>
              {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
          <Avatar size="sm"  cursor="pointer" name={user.name} src={user.pic}/>
        </MenuButton>
        <MenuList>
          <ProfileModal user={user}>
            <MenuItem>My Profile</MenuItem>
          </ProfileModal>
          <MenuDivider />
          <MenuItem onClick={logoutHandler}>logout</MenuItem>
        </MenuList>
      </Menu>
    </div>
  </Box>
  <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" paddingBottom={2}>
              <Input
                placeholder="Search by name or email"
                marginRight={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading /> 
            ) : ( 
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
  </>
};

export default SideDrawer;
