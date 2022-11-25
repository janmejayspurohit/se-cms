import React from "react";
import { FormControl, FormLabel, FormErrorMessage, Flex, Button } from "@chakra-ui/react";
import { FastField, getIn } from "formik";
import PropTypes from "prop-types";
import CreatableSelect from "react-select/creatable";

function MultiSelectField(props) {
  const { options = [], enableSelectAll = false } = props;

  const getDefaultFieldValue = (values) => {
    if (!values) return;
    if (!Array.isArray(values)) values = [values];

    const valueArray = [];
    for (const value of values) {
      valueArray.push(undefined);
      if (typeof value === "object") {
        valueArray.push(value);
        continue;
      }
      valueArray.push(options.find((o) => o.value === value));
    }

    return valueArray.filter((v) => !!v);
  };

  return (
    <FastField name={props.name}>
      {({ field, form }) => {
        const fieldValue = getDefaultFieldValue(field.value);

        return (
          <Flex direction={props.direction} {...props.containerStyle}>
            <FormControl
              isInvalid={getIn(form.errors, props.name) && getIn(form.touched, props.name)}
              w={"100%"}
              isRequired={props.isRequired}
            >
              {props.showHeader && (
                <Flex direction="row" align="center" justifyContent="space-between">
                  <FormLabel w={"100%"} htmlFor={props.name} isRequired={props.isRequired}>
                    {props.label}
                  </FormLabel>
                  {enableSelectAll && (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      mb="5px"
                      isDisabled={props.isDisabled}
                      onClick={() =>
                        form.setFieldValue(
                          props.name,
                          options.map((o) => o.value)
                        )
                      }
                    >
                      SELECT ALL
                    </Button>
                  )}
                </Flex>
              )}
              <CreatableSelect
                value={fieldValue}
                instanceId={props.name}
                isMulti
                name={props.name}
                options={props.options}
                onChange={(selectedValues) => {
                  form.setFieldValue(props.name, (selectedValues && selectedValues.map((el) => el.value)) || []);
                }}
                isDisabled={props.isDisabled}
                styles={{
                  menu: (provided, state) => ({
                    ...provided,
                    zIndex: 3,
                  }),
                }}
              />
              <FormErrorMessage>{getIn(form.errors, props.name)}</FormErrorMessage>
            </FormControl>
          </Flex>
        );
      }}
    </FastField>
  );
}

MultiSelectField.defaultProps = {
  label: "Label",
  isRequired: false,
  isDisabled: false,
  options: [],
  direction: { xs: "column", md: "row" },
  showHeader: true,
  containerStyle: {},
};

MultiSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  options: PropTypes.array.isRequired,
  showHeader: PropTypes.bool,
  containerStyle: PropTypes.object,
};

export default MultiSelectField;
