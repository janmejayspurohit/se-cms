const Joi = require("joi");
const { HttpBadRequest } = require("../custom_exceptions/http.error");
const sanitizeRequest = require("./sanitize_request");

const DEFAULT_VALIDATION_OPTION = {
  stripUnknown: true,
};
const DEFAULT_GENERIC_VALIDATOR_OPTION = {
  bodyKey: "body",
};

const schemaValidate = (schema = Joi.object({}), data = {}, options = DEFAULT_VALIDATION_OPTION) => {
  const validationResult = schema.validate(data, options);

  return validationResult;
};

const errorFormatting = (error) => {
  const { details } = error;
  const message = details.map((i) => {
    return {
      attribute: i.context.label,
      message: i.message,
    };
  });

  return message;
};

const genericValidator = (schema = Joi.object({}), request, options = DEFAULT_GENERIC_VALIDATOR_OPTION) => {
  const { bodyKey } = options;
  const { value, error } = schemaValidate(schema, request[bodyKey]);
  if (error) {
    const message = errorFormatting(error);
    throw new HttpBadRequest(message);
  }
  request = sanitizeRequest(request, value);
  return request;
};

module.exports = { schemaValidate, errorFormatting, genericValidator };
