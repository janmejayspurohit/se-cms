const Joi = require("joi");
const { User } = require("../../models");
const asyncHandler = require("../../utils/async_handler");
const { genericValidator } = require("../../utils/validation.util");

const createUserValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  gender: Joi.string().valid(...Object.values(User.GENDERS)),
  country_code: Joi.string().required(),
  phone_number: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid(...Object.values(User.ROLES)),
});

const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  status: Joi.string().valid(...Object.values(User.STATUSES)),
  gender: Joi.string().valid(...Object.values(User.GENDERS)),
  role: Joi.string().valid(...Object.values(User.ROLES)),
  country_code: Joi.string(),
  phone_number: Joi.string(),
  address: Joi.string(),
});

const createUserValidationMiddleware = asyncHandler(async (request, _, next) => {
  request = genericValidator(createUserValidationSchema, request);
  next();
});

const updateUserValidationMiddleware = asyncHandler(async (request, _, next) => {
  request = genericValidator(updateUserSchema, request);
  next();
});

module.exports = {
  createUserValidationMiddleware,
  updateUserValidationMiddleware,
};
