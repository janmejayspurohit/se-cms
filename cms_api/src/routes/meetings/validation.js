const Joi = require("joi");
const asyncHandler = require("../../utils/async_handler");
const { genericValidator } = require("../../utils/validation.util");

const createMeetingSchema = Joi.object({
  project_id: Joi.number().required(),
  meeting_id: Joi.string().required(),
  meeting_link: Joi.string().required(),
  starts_at: Joi.date().required(),
  ends_at: Joi.date().required(),
  mom: Joi.string().required(),
});

const createMeetingValidationMiddleware = asyncHandler(async (request, _, next) => {
  request = genericValidator(createMeetingSchema, request);
  next();
});

module.exports = {
  createMeetingValidationMiddleware,
};
