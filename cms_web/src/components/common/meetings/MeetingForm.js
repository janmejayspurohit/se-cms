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

const MeetingForm = (props) => {
  const {
    id: meeting_id_ = "",
    project_id = "",
    meeting_id = "",
    meeting_link = "",
    starts_at = new Date(),
    ends_at = new Date(),
    mom = "",
    pageRefresher,
    onClose,
  } = props;
  const toast = useCustomToastr();
  const [projects, setProjects] = React.useState([]);

  let initialValues = {
    project_id,
    meeting_id,
    meeting_link,
    starts_at: new Date(starts_at),
    ends_at: new Date(ends_at),
    mom,
  };

  const formSchema = Yup.object().shape({
    project_id: Yup.string().required("Project is required"),
    meeting_id: Yup.string().required("Meeting ID is required"),
    meeting_link: Yup.string().required("Meeting Link is required"),
    starts_at: Yup.string().required("Starts At is required"),
    ends_at: Yup.string().required("Ends At is required"),
    mom: Yup.string().required("MOM is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    let apiRequest;
    let message = "Meeting added successfully";
    if (meeting_id_) {
      apiRequest = api.put(`${MEETINGS}/${meeting_id_}`, values);
      message = "Meeting updated successfully";
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
              {meeting_id_ && (
                <Stack isInline>
                  <Text fontWeight="bold">Meeting ID: </Text>
                  <Text>{meeting_id_}</Text>
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
              <InputField direction="column" isInline={false} label="Meeting ID" name="meeting_id" isRequired {...props} />
              <InputField direction="column" isInline={false} label="Meeting Link" name="meeting_link" isRequired {...props} />
              <DatePickerField dateFormat="dd/MM/yyyy, hh:mm a" showTimeSelect label="Starts At" name="starts_at" isRequired {...props} />
              <DatePickerField dateFormat="dd/MM/yyyy, hh:mm a" showTimeSelect label="Ends At" name="ends_at" isRequired {...props} />
              <TextAreaField label="MOM" name="mom" placeholder="Enter requirements" isRequired showHeader={true} {...props} />
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

export default MeetingForm;
