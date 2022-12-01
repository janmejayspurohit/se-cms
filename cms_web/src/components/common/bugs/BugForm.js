import React from "react";
import useCustomToastr from "../../../utils/useCustomToastr";
import * as Yup from "yup";
import api from "../../../services/api";
import { MEETINGS, ACTIVE_PROJECTS } from "../../../constants/apiRoutes";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { DatePickerField, InputField, SelectField, TextAreaField } from "../../formik";
import Button from "../Button";

const BugForm = (props) => {
  const { id: bug_id = "", project_id = "", description = "", deadline = new Date(), pageRefresher, onClose } = props;
  const toast = useCustomToastr();
  const [projects, setProjects] = React.useState([]);

  let initialValues = {
    project_id,
    description,
    deadline,
  };

  const formSchema = Yup.object().shape({
    project_id: Yup.string().required("Project is required"),
    description: Yup.string().required("Description is required"),
    deadline: Yup.date().required("Deadline is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    let apiRequest;
    let message = "Bug added successfully";
    if (bug_id) {
      apiRequest = api.put(`${MEETINGS}/${bug_id}`, values);
      message = "Bug updated successfully";
    } else {
      apiRequest = api.post(MEETINGS, values);
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

  React.useEffect(() => {
    api
      .get(ACTIVE_PROJECTS)
      .then((response) => {
        setProjects(response.data.projects || []);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
      });
  }, []);

  return (
    <Box>
      <Formik initialValues={initialValues} validationSchema={formSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {(props) => (
          <Form autoComplete="off">
            <Stack spacing={4}>
              {bug_id && (
                <Stack isInline>
                  <Text fontWeight="bold">Bug ID: </Text>
                  <Text>{bug_id}</Text>
                </Stack>
              )}
              {projects.length > 0 && (
                <SelectField
                  {...props}
                  name="project_id"
                  label="Project"
                  placeholder="Select Project..."
                  isRequired
                  options={projects.map((u) => ({ label: u.name, value: u.id }))}
                />
              )}
              <DatePickerField dateFormat="dd/MM/yyyy, hh:mm a" showTimeSelect label="Deadline" name="deadline" isRequired {...props} />
              <TextAreaField
                label="Description"
                name="description"
                placeholder="Enter description"
                isRequired
                showHeader={true}
                {...props}
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

export default BugForm;
