import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../../services/auth";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <Flex flexDirection={["column", "column", "row", "row"]} w="100%" minH="100vh">
      <Box bg="primary" display={["none", "none", "block", "block"]} w={isExpanded ? "12%" : "3%"} pl={[0, 0, 0, 1]} pr={1}>
        <Flex
          position="relative"
          top="0"
          align={isExpanded ? "right" : "center"}
          fontSize={20}
          color="white"
          fontWeight="bold"
          p="2"
          justifyContent={isExpanded ? "space-between" : "center"}
        >
          {isExpanded && "CMS"}
          <Box onClick={() => setIsExpanded(!isExpanded)} cursor="pointer" alignSelf="center" position="relative" right="0">
            <GiHamburgerMenu color="white" />
          </Box>
        </Flex>
        <Sidebar isExpanded={isExpanded} />
      </Box>
      <Box display="block" bg="tertiary" w={isExpanded ? ["100%", "100%", "88%", "88%"] : ["100%", "100%", "97%", "97%"]} p="4">
        <Flex justify="flex-end" align="center" mb="4">
          <Flex
            align="center"
            background={user?.role == "user" ? "blue.100" : "green.200"}
            p="2"
            border="2px"
            borderRadius="10px"
            borderColor="gray.300"
          >
            <Text>{user?.name || "Guest"}</Text>
            <Box w="0.1em" h="1em" mx="0.7em" background="primary" />
            <Text>{user?.role || "User"}</Text>
          </Flex>
        </Flex>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
