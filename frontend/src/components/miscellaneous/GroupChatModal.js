import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import {FormControl}  from "@chakra-ui/form-control";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";


const GroupChatModal=({children})=>{
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        method:"GET",
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const response= await fetch(`/api/user?search=${search}`, config);
      const data=await response.json();
      // console.log(data);
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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
        const requestData = {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map(u => u._id))
        };

        const config = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(requestData) // Convert data to JSON string
        };
        const response= await fetch("/api/chat/group",config);
        const data=await response.json();
        setChats([data, ...chats]);
        onClose();
        toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup=(userToAdd)=>{
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
                <Input placeholder="Chat Name" mb={3} onChange={(e)=>setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
                <Input placeholder="Add Users eg: John, Sam, Jane" mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            {/* selected users */}
            <Box display="flex" width="100%" flexWrap="wrap">
                {selectedUsers.map(u=>(
                    <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)} />
                ))}
            </Box>
            {/* render searched users */}
            {loading ? <div>loading</div>:(
                searchResult?.slice(0,4).map(userr=>(
                    <UserListItem key={userr._id} user={userr} handleFunction={()=>handleGroup(userr)}/>
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
