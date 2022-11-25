import React from "react";
import useCustomToastr from "../../../utils/useCustomToastr";
import * as Yup from "yup";
import api from "../../../services/api";
import { USERS } from "../../../constants/apiRoutes";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField, SelectField } from "../../formik";
import Button from "../Button";

const UserForm = (props) => {
  const {
    id: user_id = "",
    name = "",
    email = "",
    address = "",
    country_code = "",
    phone_number = "",
    encrypted_password: password = "",
    gender = "",
    status = "",
    role = "",
    pageRefresher,
    onClose,
  } = props;
  const toast = useCustomToastr();

  let initialValues = {
    name,
    email,
    address,
    country_code,
    phone_number,
    password,
    gender,
    status,
    role,
  };

  const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().required("Required"),
    country_code: Yup.string().required("Required"),
    phone_number: Yup.string().required("Required"),
    password: Yup.string(),
    status: Yup.string().required("Required"),
    role: Yup.string().required("Required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    let apiRequest;
    let message = "User added successfully";
    if (user_id) {
      apiRequest = api.put(`${USERS}/${user_id}`, values);
      message = "User updated successfully";
    } else {
      apiRequest = api.post(USERS, values);
    }
    apiRequest
      .then(() => {
        toast.showSuccess(message);
        pageRefresher();
        onClose();
        setSubmitting(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        setSubmitting(false);
        toast.showError(e);
      });
  };

  return (
    <Box>
      <Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {(props) => (
          <Form autoComplete="off">
            <Stack spacing={4}>
              {user_id && (
                <Stack isInline>
                  <Text fontWeight="bold">User ID: </Text>
                  <Text>{user_id}</Text>
                </Stack>
              )}
              <InputField direction="column" isInline={false} label="Name" name="name" isRequired {...props} />
              <InputField direction="column" isInline={false} label="Email" name="email" isRequired {...props} />
              <InputField direction="column" isInline={false} label="Address" name="address" {...props} />
              <InputField direction="column" isInline={false} label="Country Code" name="country_code" isRequired {...props} />
              <InputField direction="column" isInline={false} label="Phone Number" name="phone_number" isRequired {...props} />
              {!user_id && <InputField direction="column" isInline={false} label="Password" name="password" {...props} />}
              <SelectField
                {...props}
                name="gender"
                label="Gender"
                placeholder="Select gender"
                options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHERS", label: "Others" },
                ]}
              />
              <SelectField
                {...props}
                name="status"
                label="Status"
                placeholder="Select status"
                isRequired
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "DELETED", label: "Deleted" },
                  { value: "SUSPENDED", label: "Suspended" },
                ]}
              />
              <SelectField
                {...props}
                name="role"
                label="Role"
                placeholder="Select Role"
                isRequired
                options={[
                  { value: "USER", label: "User" },
                  { value: "ADMIN", label: "Admin" },
                ]}
              />
              <Stack isInline justifyContent="center" spacing="8">
                <Button variant="outline" color="primary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={props.isSubmitting}>
                  Submit
                </Button>
              </Stack>
              <Divider />
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default UserForm;
