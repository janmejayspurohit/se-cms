const { AppResponse } = require("./app_response");
const { DatabaseError } = require("../custom_exceptions/database.error");
const { ValidationError } = require("sequelize");
const errorStatusCodes = require("../custom_exceptions/http_status_codes");

const handleError = (error) => {
  if (error.name && error.name.includes("Sequelize")) {
    const errorCode =
      error instanceof ValidationError
        ? errorStatusCodes.BAD_REQUEST
        : errorStatusCodes.INTERNAL_SERVER_ERROR;

    let errors = [];

    if (error instanceof ValidationError) {
      errors = error.errors.map((e) => {
        return {
          attribute: e.path,
          message: e.message,
        };
      });
    }

    const databaseError = new DatabaseError(error.message, errors);
    return AppResponse.error({
      statusCode: errorCode,
      data: {
        ...databaseError,
        message: errors.length > 0 ? errors[0].message : databaseError.message,
      },
      error: databaseError,
    });
  }

  return AppResponse.error({
    statusCode: error.statusCode,
    data: {
      ...error,
      data: {},
      message: error.message || "Your request has error",
    },
    error,
  });
};

const asyncHandler = (fn) =>
  function asyncHandlerWrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];

    return Promise.resolve(fnReturn).catch((e) => {
      const errorResponse = handleError(e);
      next(errorResponse);
    });
  };

module.exports = asyncHandler;
