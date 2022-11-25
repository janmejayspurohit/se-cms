import React from "react";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField } from "../../formik";
import * as Yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
// import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { useAuth } from "../../../services/auth";
import useCustomToastr from "../../../utils/useCustomToastr";
import Button from "../../common/Button";

const ResetCredentials = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useCustomToastr();

  const loginFormSchema = Yup.object().shape({
    email: Yup.string().min(2, "Too Short!").required("Required"),
  });

  const initialValues = {
    email: "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    toast.showSuccess({ description: "Password reset link sent to your email" });
    navigate("/login");
    setSubmitting(false);
  };

  return user?.role ? (
    <Navigate to={`/${user.role}/home`} replace />
  ) : (
    <Flex bg="white" pos="fixed" top="0" left="0" right="0" bottom="0" zIndex={2}>
      <Link to="/">
        <Text fontSize="xl" fontWeight="bold" cursor="pointer" p="6">
          CMS
        </Text>
      </Link>
      <Flex w={{ base: "100%", lg: "50%" }} direction="column" align="center" justify="center">
        <Text fontSize="2xl" fontWeight="600" textAlign="left">
          Reset Credentials!
        </Text>
        <Box w={"60%"} mt={10}>
          <Formik initialValues={initialValues} validationSchema={loginFormSchema} onSubmit={onSubmit} enableReinitialize={true}>
            {(props) => (
              <Form autoComplete="off">
                <Stack mx="3" spacing={5}>
                  <InputField isInline={false} direction="column" label="Email" name="email" isRequired {...props} />
                  {/* submit button */}
                  <Button colorScheme="green" type="submit" isLoading={props.isSubmitting}>
                    Reset Credentials
                  </Button>
                  <Link to="/login">
                    <Text fontSize="sm">Login?</Text>
                  </Link>
                  <Link to="/register">
                    <Text fontSize="sm">New User?</Text>
                  </Link>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ResetCredentials;
