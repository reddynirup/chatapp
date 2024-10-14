import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Image,
  Flex
} from "@chakra-ui/react";
import IMG from './icon.png'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage=()=> {
  const navigate=useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats",{replace:true});
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Flex 
        justifyContent="center"
        p={2}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box display="flex" alignItems="center">
          <Image sizes="xl" src={IMG} alt='Dan Abramov' />
        </Box>
        <Box display="flex" alignItems="center">
          <Text fontSize="4xl" fontFamily="Work sans" align="center">
            Talk-A-Tive
          </Text>
        </Box>
      </Flex>
      <Box background="white" width="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;