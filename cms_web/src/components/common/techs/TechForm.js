import React from "react";
import useCustomToastr from "../../../utils/useCustomToastr";
import * as Yup from "yup";
import api from "../../../services/api";
import { TECHS } from "../../../constants/apiRoutes";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { CheckBoxField, DatePickerField, InputField } from "../../formik";
import Button from "../Button";

const TechForm = (props) => {
  const { id: tech_id = "", name = "", is_active = true, pageRefresher, onClose } = props;
  const toast = useCustomToastr();

  let initialValues = {
    name,
    is_active,
  };

  const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    is_active: Yup.boolean().required("Required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    let apiRequest;
    let message = "Tech added successfully";
    if (tech_id) {
      apiRequest = api.put(`${TECHS}/${tech_id}`, values);
      message = "Tech updated successfully";
    } else {
      apiRequest = api.post(TECHS, values);
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
              {tech_id && (
                <Stack isInline>
                  <Text fontWeight="bold">Tech ID: </Text>
                  <Text>{tech_id}</Text>
                </Stack>
              )}
              <InputField direction="column" isInline={false} label="Name" name="name" isRequired {...props} />
              <CheckBoxField direction="column" isInline={false} label="Active" name="is_active" {...props} />
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

export default TechForm;
