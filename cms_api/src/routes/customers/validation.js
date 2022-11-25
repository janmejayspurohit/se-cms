const Joi = require("joi");
const asyncHandler = require("../../utils/async_handler");
const { genericValidator } = require("../../utils/validation.util");

const createCustomerSchema = Joi.object({
  company_name: Joi.string().required(),
  address: Joi.string().required(),
  incharge: Joi.number().required(),
  phone_number: Joi.string().required(),
});

const createCustomerValidationMiddleware = asyncHandler(async (request, _, next) => {
  request = genericValidator(createCustomerSchema, request);
  next();
});

module.exports = {
  createCustomerValidationMiddleware,
};
