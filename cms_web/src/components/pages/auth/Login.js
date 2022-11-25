import React from "react";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField, PasswordField } from "../../formik";
import * as Yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../services/auth";
import api from "../../../services/api";
import { LOGIN } from "../../../constants/apiRoutes";
import useCustomToastr from "../../../utils/useCustomToastr";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import Button from "../../common/Button";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useCustomToastr();

  const loginFormSchema = Yup.object().shape({
    email: Yup.string().min(2, "Too Short!").required("Required"),
    password: Yup.string().min(2, "Too Short!").required("Required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    api
      .post(LOGIN, values)
      .then((response) => {
        const { token, user } = response.data;
        user.role = user.role?.toLowerCase();
        localStorage.setItem("seCmsAuth", JSON.stringify({ user, token }));
        navigate(`/${user.role}/home`);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setSubmitting(false);
      });
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
          Dashboard Login!
        </Text>
        <Box w={"60%"} mt={10}>
          <Formik initialValues={initialValues} validationSchema={loginFormSchema} onSubmit={onSubmit} enableReinitialize={true}>
            {(props) => (
              <Form autoComplete="off">
                <Stack mx="3" spacing={5}>
                  <InputField isInline={false} direction="column" label="Email" name="email" isRequired />
                  <PasswordField isInline={false} direction="column" label="Password" name="password" isRequired />
                  {/* submit button */}
                  <Button colorScheme="green" type="submit" isLoading={props.isSubmitting}>
                    Login
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;
