const { HttpInternalServerError } = require("../custom_exceptions/http.error");

class AppResponse {
  constructor({ data = {}, statusCode = 200 }) {
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date();
  }

  static success = ({ data = {}, statusCode = 200 } = {}) => ({
    statusCode,
    data,
    timestamp: new Date(),
  });

  static error = ({ data = {}, statusCode = 500, error = new HttpInternalServerError("Something went wrong!") } = {}) => ({
    statusCode,
    error: data,
    timestamp: new Date(),
    stack: error.stack,
  });
}

const SendResponse = (appResponse) => {
  appResponse.statusCode = appResponse.statusCode;
  appResponse.success = appResponse.statusCode >= 200 && appResponse.statusCode < 400;
  const response = {
    success: appResponse.success,
    timestamp: appResponse.timestamp,
    data: appResponse.data,
    error: appResponse.error,
    stack: appResponse.stack,
  };

  return response;
};

module.exports = { AppResponse, SendResponse };
