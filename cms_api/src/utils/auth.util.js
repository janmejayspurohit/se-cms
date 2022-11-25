const jwt = require("jsonwebtoken");
const { HttpUnAuthorized, HttpInternalServerError } = require("../custom_exceptions/http.error");

const DEFAULT_JWT_SIGN_IN_OPTIONS = {
  expiresIn: "1d",
};

const decodeToken = (token) => {
  const decodedToken = jwt.decode(token, { json: true });
  return decodedToken;
};

const signTokenWith = (payload, options = DEFAULT_JWT_SIGN_IN_OPTIONS) => {
  const secretKey = process.env.APP_SECRET;
  if (!secretKey) throw new HttpInternalServerError("Failed to Sign a token");

  const token = jwt.sign(payload, secretKey, options);
  return token;
};

const verifyToken = async (token) => {
  if (!token) throw new HttpUnAuthorized("Auth Token is missing");
  const secretKey = process.env.APP_SECRET;
  if (!secretKey) throw new HttpInternalServerError("Failed to verify the token");

  try {
    const tokenPayload = jwt.verify(token, secretKey);
    return tokenPayload;
  } catch (e) {
    throw new HttpUnAuthorized(e);
  }
};

module.exports = {
  decodeToken,
  signTokenWith,
  verifyToken,
};
