const http_status_codes = require("./http_status_codes");
const { HttpError } = require("./http.error");

class DatabaseError extends HttpError {
  constructor(message = "Database Error", data) {
    super({
      message,
      name: "DATABASE_ERROR",
      status_code: http_status_codes.BAD_REQUEST,
      data,
    });
  }
}

module.exports = {
  DatabaseError,
};
