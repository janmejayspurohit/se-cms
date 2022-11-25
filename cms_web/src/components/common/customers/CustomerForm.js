import React from "react";
import useCustomToastr from "../../../utils/useCustomToastr";
import * as Yup from "yup";
import api from "../../../services/api";
import { CUSTOMERS, ALL_USERS } from "../../../constants/apiRoutes";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField, SelectField } from "../../formik";
import Button from "../Button";

const CustomerForm = (props) => {
  const { id: customer_id = "", company_name = "", address = "", incharge = "", phone_number = "", pageRefresher, onClose } = props;
  const toast = useCustomToastr();
  const [users, setUsers] = React.useState([]);

  let initialValues = {
    company_name,
    address,
    incharge,
    phone_number,
  };

  const formSchema = Yup.object().shape({
    company_name: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    incharge: Yup.string().required("Required"),
    phone_number: Yup.string().required("Required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    let apiRequest;
    let message = "Customer added successfully";
    if (customer_id) {
      apiRequest = api.put(`${CUSTOMERS}/${customer_id}`, values);
      message = "Customer updated successfully";
    } else {
      apiRequest = api.post(CUSTOMERS, values);
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
              {customer_id && (
                <Stack isInline>
                  <Text fontWeight="bold">Customer ID: </Text>
                  <Text>{customer_id}</Text>
                </Stack>
              )}
              <InputField direction="column" isInline={false} label="Company Name" name="company_name" isRequired {...props} />
              <InputField direction="column" isInline={false} label="Address" name="address" isRequired {...props} />
              <InputField direction="column" isInline={false} label="Phone Number" name="phone_number" isRequired {...props} />
              <SelectField
                {...props}
                name="incharge"
                label="Incharge"
                placeholder="Select..."
                isRequired
                options={users.map((u) => ({ label: u.name, value: u.id }))}
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

export default CustomerForm;
