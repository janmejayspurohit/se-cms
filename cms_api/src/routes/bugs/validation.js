const Joi = require("joi");
const asyncHandler = require("../../utils/async_handler");
const { genericValidator } = require("../../utils/validation.util");

const createBugSchema = Joi.object({
  project_id: Joi.number().required(),
  description: Joi.string().required(),
  deadline: Joi.date().required(),
});

const createBugValidationMiddleware = asyncHandler(async (request, _, next) => {
  request = genericValidator(createBugSchema, request);
  next();
});

module.exports = {
  createBugValidationMiddleware,
};
