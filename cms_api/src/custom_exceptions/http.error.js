const http_status_codes = require("./http_status_codes");

class HttpError extends Error {
  constructor({ message, name, statusCode, data }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    Error.captureStackTrace(this, HttpError);
  }
}

class HttpBadRequest extends HttpError {
  constructor(message = "Bad request", data) {
    super({
      message,
      name: "HTTP_BAD_REQUEST",
      statusCode: http_status_codes.BAD_REQUEST,
      data,
    });
  }
}

class HttpNotFound extends HttpError {
  constructor(message = "Not Found", data) {
    super({
      message,
      name: "HTTP_NOT_FOUND",
      statusCode: http_status_codes.NOT_FOUND,
      data,
    });
  }
}

class HttpInternalServerError extends HttpError {
  constructor(message = "Internal server error", data) {
    super({
      message,
      name: "HTTP_INTERNAL_SERVER_ERROR",
      statusCode: http_status_codes.INTERNAL_SERVER_ERROR,
      data,
    });
  }
}

class HttpUnAuthorized extends HttpError {
  constructor(message = "Un Authorized", data) {
    super({
      message,
      name: "HTTP_UNAUTHORIZED",
      statusCode: http_status_codes.UNAUTHORIZED,
      data,
    });
  }
}

class HttpUnProcessableEntity extends HttpError {
  constructor(message = "Unprocessable Entity", data) {
    super({
      message,
      name: "HTTP_UNPROCESSABLE_ENTITY",
      statusCode: http_status_codes.UNPROCESSABLE_ENTITY,
      data,
    });
  }
}

class HttpForbidden extends HttpError {
  constructor(message = "REQUEST FORBIDDEN", data) {
    super({
      message,
      name: "HTTP_REQUEST_FORBIDDEN",
      statusCode: http_status_codes.FORBIDDEN,
      data,
    });
  }
}

module.exports = {
  HttpError,
  HttpBadRequest,
  HttpNotFound,
  HttpInternalServerError,
  HttpUnAuthorized,
  HttpUnProcessableEntity,
  HttpForbidden,
};
