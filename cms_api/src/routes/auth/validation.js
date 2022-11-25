const Joi = require("joi");
const { User } = require("../../models");
const asyncHandler = require("../../utils/async_handler");
const { genericValidator } = require("../../utils/validation.util");

const signupRequestSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string(),
  gender: Joi.string().valid(...Object.values(User.GENDERS)),
  country_code: Joi.string().valid("+91"),
  phone_number: Joi.string().required(),
  category: Joi.string().valid(...Object.values(User.ROLES)),
  address: Joi.object(),
  skills: Joi.array().items(Joi.string()),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signupValidationMiddleware = asyncHandler(async (request, _, next) => {
  request.body.address = JSON.parse(request.body.address);
  request.body.skills = JSON.parse(request.body.skills);
  request = genericValidator(signupRequestSchema, request);
  next();
});

const loginValidationMiddleware = asyncHandler(async (request, _, next) => {
  request = genericValidator(loginRequestSchema, request);
  next();
});

module.exports = {
  loginValidationMiddleware,
  signupValidationMiddleware,
};
