import React from "react";
import useCustomToastr from "../../../utils/useCustomToastr";
import * as Yup from "yup";
import api from "../../../services/api";
import { ALL_CUSTOMERS, ALL_USERS, PROJECTS } from "../../../constants/apiRoutes";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { Box, Divider, FormLabel, Stack, Text } from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import { InputField, MultiSelectField, SelectField, TextAreaField } from "../../formik";
import Button from "../Button";
import { AiOutlineDelete } from "react-icons/ai";
import { useAuth } from "../../../services/auth";

const ProjectForm = (props) => {
  const {
    id: project_id = "",
    customer_id = "",
    name = "",
    requirements = "",
    project_manager = "",
    assigned_engineers = [],
    timeline = [],
    status = "",
    pageRefresher,
    onClose,
  } = props;
  const toast = useCustomToastr();
  const [users, setUsers] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const { user } = useAuth();

  let initialValues = {
    customer_id,
    name,
    requirements,
    project_manager,
    assigned_engineers,
    timeline,
    status,
  };

  if (user.role === "user")
    initialValues = {
      ...initialValues,
      project_manager: user.id,
    };

  const formSchema = Yup.object().shape({
    customer_id: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    requirements: Yup.string().required("Required"),
    project_manager: Yup.string().required("Required"),
    assigned_engineers: Yup.array().required("Required"),
    timeline: Yup.array().required("Required"),
    status: Yup.string().required("Required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    let apiRequest;
    let message = "Project added successfully";
    if (project_id) {
      apiRequest = api.put(`${PROJECTS}/${project_id}`, values);
      message = "Project updated successfully";
    } else {
      apiRequest = api.post(PROJECTS, values);
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
      .get(ALL_CUSTOMERS)
      .then((response) => {
        setCustomers(response.data.customers || []);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
      });
    api
      .get(ALL_USERS)
      .then((response) => {
        setUsers(response.data.users || []);
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
              {project_id && (
                <Stack isInline>
                  <Text fontWeight="bold">Project ID: </Text>
                  <Text>{project_id}</Text>
                </Stack>
              )}
              {customers.length > 0 && (
                <SelectField
                  {...props}
                  isRequired
                  name="customer_id"
                  label="Customer"
                  placeholder="Select customer"
                  options={customers.map((c) => ({
                    value: c.id,
                    label: c.company_name,
                  }))}
                />
              )}
              <InputField direction="column" isInline={false} label="Name" name="name" isRequired {...props} />
              <TextAreaField
                label="Requirements"
                name={"requirements"}
                placeholder="Enter requirements"
                isRequired
                showHeader={true}
                {...props}
              />
              {users.length > 0 && (
                <SelectField
                  {...props}
                  isRequired
                  name="project_manager"
                  label="Project Manager"
                  placeholder="Select..."
                  disabled={user.role === "user"}
                  options={users.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                />
              )}
              {users.length > 0 && (
                <MultiSelectField
                  {...props}
                  isRequired
                  name="assigned_engineers"
                  label="Assigned Engineers"
                  placeholder="Select..."
                  options={users.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                />
              )}
              <SelectField
                {...props}
                name="status"
                label="Status"
                placeholder="Select..."
                isRequired
                options={["CREATED", "STARTED", "IN_PROGRESS", "COMPLETED", "DROPPED"].map((s) => ({ label: s, value: s }))}
              />
              <FieldArray name="timeline">
                {({ remove, push }) => (
                  <Stack width={"100%"}>
                    <FormLabel>Timelines</FormLabel>
                    {Object.keys(props.values.timeline).map((t, index) => (
                      <Box pos="relative" bg="tertiary" key={index} borderRadius="5px" p="4">
                        <Box pos="absolute" top="1" right="1" m="1" rounded="lg" background="red.500" color="white">
                          <Button
                            type="button"
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <AiOutlineDelete size="1.5em" />
                          </Button>
                        </Box>
                        <FormLabel fontWeight="bold">Timeline {index + 1}</FormLabel>
                        <Stack direction={["column", "row"]} mb="2" alignItems="center" spacing={8}>
                          <Stack width={{ base: "100%", lg: "70%" }}>
                            <InputField
                              label="Title"
                              name={`timeline.${index}.title`}
                              placeholder="Title"
                              showHeader={true}
                              isInline={false}
                            />
                            <TextAreaField
                              label="Description"
                              name={`timeline.${index}.description`}
                              placeholder="Description"
                              showHeader={true}
                            />
                          </Stack>
                        </Stack>
                      </Box>
                    ))}
                    <Button
                      size="sm"
                      width={{ base: "50%", lg: "30%" }}
                      onClick={() => push({ title: "", description: "", created_at: new Date(), created_by: user.id })}
                      leftIcon={"+ Add Timeline"}
                    />
                  </Stack>
                )}
              </FieldArray>
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

export default ProjectForm;
