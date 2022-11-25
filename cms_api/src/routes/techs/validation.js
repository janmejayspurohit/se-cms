const Joi = require("joi");
const asyncHandler = require("../../utils/async_handler");
const { genericValidator } = require("../../utils/validation.util");

const createTechSchema = Joi.object({
  name: Joi.string().required(),
  is_active: Joi.boolean().required(),
});

const createTechValidationMiddleware = asyncHandler(async (request, _, next) => {
  request = genericValidator(createTechSchema, request);
  next();
});

module.exports = {
  createTechValidationMiddleware,
};
