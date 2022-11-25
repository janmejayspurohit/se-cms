const router = require("express").Router();
const asyncHandler = require("../../utils/async_handler");
const { AppResponse } = require("../../utils/app_response");
const { HttpBadRequest } = require("../../custom_exceptions/http.error");
const { signTokenWith, decodeToken } = require("../../utils/auth.util");
const { comparePassword, hashPassword } = require("../../utils/password.util");
const authenticateUserMiddleware = require("../../middlewares/authenticate");

//MODELS
const { User, AuthToken } = require("../../models");

//MIDDLEWARES
const { loginValidationMiddleware, signupValidationMiddleware } = require("./validation");

router.post(
  "/signup",
  signupValidationMiddleware,

  asyncHandler(async (request, _, next) => {
    const { phone_number, password } = request.permitted;
    const oldUser = await User.findOne({ where: { phone_number } });
    if (oldUser) throw new HttpBadRequest("User exists, please login!");

    const encrypted_password = await hashPassword(password);
    delete request.permitted.password;

    const user = await User.create({ ...request.permitted, encrypted_password });
    const authToken = signTokenWith({ userId: user.id, role: user.role });
    const refreshToken = signTokenWith({
      userId: user.id,
      role: user.role,
    });

    const decodedAuthToken = decodeToken(authToken),
      decodedRefreshToken = decodeToken(refreshToken);

    const authTokenExpiresAt = new Date(decodedAuthToken.exp * 1000);
    const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000);

    user.createAuth_token({
      authToken,
      refreshToken,
      authTokenExpiresAt,
      refreshTokenExpiresAt,
    });

    next(
      AppResponse.success({
        data: { token: authToken, user },
      })
    );
  })
);

router.post(
  "/login",
  loginValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const { email, password } = request.permitted;

    const user = await User.unscoped().findOne({ where: { email } });
    if (!user) throw new HttpBadRequest("User not found!");

    const validPassword = await comparePassword(password, user.encrypted_password);
    if (!validPassword) throw new HttpBadRequest("Invalid Username or password");

    const auth_token = signTokenWith({ userId: user.id, role: user.role });
    const refresh_token = signTokenWith({
      userId: user.id,
      role: user.role,
    });

    const decodedAuthToken = decodeToken(auth_token),
      decodedRefreshToken = decodeToken(refresh_token);

    const auth_token_expires_at = new Date(decodedAuthToken.exp * 1000);
    const refresh_token_expires_at = new Date(decodedRefreshToken.exp * 1000);

    await user.createAuth_token({
      auth_token,
      refresh_token,
      auth_token_expires_at,
      refresh_token_expires_at,
    });

    const user_to_return = user.toJSON();
    delete user_to_return.encrypted_password;

    next(
      AppResponse.success({
        data: { token: auth_token, user: user_to_return },
      })
    );
  })
);

router.delete(
  "/logout",
  authenticateUserMiddleware,
  asyncHandler(async (request, _, next) => {
    await AuthToken.destroy({ where: { user_id: request.userId } });
    next(AppResponse.success({ data: { message: "User logged out" } }));
  })
);

module.exports = router;
