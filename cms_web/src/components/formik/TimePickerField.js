import React from "react";
import { Flex, Box, FormControl, FormLabel, FormErrorMessage, Input } from "@chakra-ui/react";
import { FastField, ErrorMessage, getIn } from "formik";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

function TimePickerField(props) {
  return (
    <FastField name={props.name}>
      {({ field, form }) => (
        <Flex direction={props.direction} {...props.containerStyle}>
          {props.showHeader && (
            <FormLabel w={"100%"} htmlFor={props.name} isRequired={props.isRequired}>
              {props.label}
            </FormLabel>
          )}
          <FormControl isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}>
            <Box>
              <DatePicker
                onChange={(time) => {
                  form.setFieldValue(props.name, time);
                }}
                selected={field.value || null}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                customInput={<Input {...field} />}
              />
            </Box>
            <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
          </FormControl>
        </Flex>
      )}
    </FastField>
  );
}

TimePickerField.defaultProps = {
  label: "Label",
  isRequired: false,
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
};

TimePickerField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
};

export default TimePickerField;
