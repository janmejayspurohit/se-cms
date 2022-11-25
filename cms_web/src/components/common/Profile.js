import { Box, Grid, Text } from "@chakra-ui/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { formattedTimestamp } from "../../utils/formattedTimestamp";
import Button from "./Button";
import Layout from "./Layout";

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Layout>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <Box background="white" border="1px" borderColor="gray.200" borderRadius="10px" p="4">
          <Text color="primary">{`Name : ${user.name}`}</Text>
        </Box>
        <Box background="white" border="1px" borderColor="gray.200" borderRadius="10px" p="4">
          <Text color="primary">{`Email : ${user.email}`}</Text>
        </Box>
        <Box background="white" border="1px" borderColor="gray.200" borderRadius="10px" p="4">
          <Text color="primary">{`Phone Number : +${user.country_code} ${user.phone_number}`}</Text>
        </Box>
        <Box background="white" border="1px" borderColor="gray.200" borderRadius="10px" p="4">
          <Text color="primary">{`Gender : ${user.gender}`}</Text>
        </Box>
        <Box background="white" border="1px" borderColor="gray.200" borderRadius="10px" p="4">
          <Text color="primary">{`Status : ${user.status}`}</Text>
        </Box>
        <Box background="white" border="1px" borderColor="gray.200" borderRadius="10px" p="4">
          <Text color="primary">{`User since : ${formattedTimestamp({ timestamp: user.created_at })}`}</Text>
        </Box>
      </Grid>
      <Link to={location.pathname + "/edit"}>
        <Button colorScheme="purple" mt="4">
          Edit Profile
        </Button>
      </Link>
    </Layout>
  );
};

export default Profile;
