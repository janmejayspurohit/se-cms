import { Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { useAuth } from "../../services/auth";
import Layout from "./Layout";
import { InputField, SelectField } from "../formik";
import * as Yup from "yup";
import api from "../../services/api";
import { USER } from "../../constants/apiRoutes";
import { formattedErrorMessage } from "../../utils/formattedErrorMessage";
import useCustomToastr from "../../utils/useCustomToastr";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const AdminProfileEdit = () => {
  const { user, token } = useAuth();
  const toast = useCustomToastr();
  const navigate = useNavigate();

  const loginFormSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").required("Required"),
    gender: Yup.string().required("Required"),
    phone_number: Yup.string().required("Required"),
  });

  const initialValues = user;

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    api
      .put(USER(user.id), values)
      .then((response) => {
        const { user } = response.data;
        user.role = user.role?.toLowerCase();
        localStorage.setItem("seCmsAuth", JSON.stringify({ user, token }));
        toast.showSuccess("Updated successfully!");
        setSubmitting(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setSubmitting(false);
      });
  };

  return (
    <Layout>
      <Stack>
        <Formik initialValues={initialValues} validationSchema={loginFormSchema} onSubmit={onSubmit} enableReinitialize={true}>
          {(props) => (
            <Form autoComplete="off">
              <Stack mx="3" spacing={5}>
                <InputField isInline={false} direction="column" label="First Name" name="name" isRequired />
                <SelectField
                  name="gender"
                  label="Gender"
                  placeholder="Select gender"
                  options={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHERS", label: "Others" },
                  ]}
                />
                {/* submit button */}
                <Stack isInline justifyContent="right">
                  <Button colorScheme="red" onClick={() => navigate(-1)}>
                    Back
                  </Button>
                  <Button colorScheme="green" type="submit" isLoading={props.isSubmitting}>
                    Update
                  </Button>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Layout>
  );
};

export default AdminProfileEdit;
