const { HttpUnProcessableEntity, HttpForbidden, HttpUnAuthorized } = require("../custom_exceptions/http.error");
const { User, AuthToken } = require("../models");
const asyncHandler = require("../utils/async_handler");
const { verifyToken } = require("../utils/auth.util");

/**
 * Reads the authorization header and parses the token
 * on successful stores the parsed user_id in request.user_id
 */
const authenticateUserMiddleware = asyncHandler(async (request, _, next) => {
  const bearerToken = request.headers.authorization;

  const { userId, role = "" } = await verifyToken(bearerToken);
  console.log("role :>> ", role, request.body);

  const authToken = await AuthToken.findOne({
    where: { user_id: userId, auth_token: bearerToken },
  });

  if (!authToken) {
    throw new HttpUnAuthorized("Token Loggedout");
  }

  const user = await User.findOne({ where: { id: userId, role } });

  if (!user) throw new HttpUnProcessableEntity("Invalid user");

  request.userId = userId;
  request.authUser = user;
  next();
});

module.exports = authenticateUserMiddleware;
