const Joi = require("joi");
const { Project } = require("../../models");
const asyncHandler = require("../../utils/async_handler");
const { genericValidator } = require("../../utils/validation.util");

const createProjectSchema = Joi.object({
  name: Joi.string().required(),
  customer_id: Joi.number().required(),
  requirements: Joi.string().required(),
  project_manager: Joi.number().required(),
  assigned_engineers: Joi.array().items(Joi.number()).required(),
  timeline: Joi.array(),
  status: Joi.string().valid(...Object.values(Project.STATUSES)),
});

const createProjectValidationMiddleware = asyncHandler(async (request, _, next) => {
  request = genericValidator(createProjectSchema, request);
  next();
});

module.exports = {
  createProjectValidationMiddleware,
};
