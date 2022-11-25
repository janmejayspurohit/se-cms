const router = require("express").Router();
const asyncHandler = require("../../utils/async_handler");
const { AppResponse } = require("../../utils/app_response");
const { HttpBadRequest } = require("../../custom_exceptions/http.error");

//MODELS
const { User } = require("../../models");

//MIDDLEWARES
const { updateUserValidationMiddleware, createUserValidationMiddleware } = require("./validation");
const { hashPassword } = require("../../utils/password.util");
const PaginatedModel = require("../../models/paginated_model");

router.get(
  "/",
  asyncHandler(async (request, _, next) => {
    const {
      query: { page = 0, size = 10 },
    } = request;
    const {
      size: sizeValue,
      page: pageValue,
      pageCount,
      items: users,
      total: totalCount,
    } = await PaginatedModel(User, { order: [["created_at", "ASC"]] }, { page, size });

    if (!users) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { users, page: pageValue, pageCount, size: sizeValue, total: totalCount },
      })
    );
  })
);

router.get(
  "/all",
  asyncHandler(async (request, _, next) => {
    const users = await User.findAll({ order: [["created_at", "ASC"]] });

    if (!users) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { users },
      })
    );
  })
);

router.post(
  "/",
  createUserValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const { password, ...userBody } = request.body;
    const encrypted_password = await hashPassword(password);
    const user = await User.create({ encrypted_password, ...userBody });
    if (!user) throw new HttpBadRequest("Something went wrong, please try again!");
    next(
      AppResponse.success({
        data: { user },
      })
    );
  })
);

router.get(
  "/:id",
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const user = await User.findByPk(id);
    if (!user) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { user },
      })
    );
  })
);

router.put(
  "/:id",
  updateUserValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const user = await User.findByPk(id);
    if (!user) throw new HttpBadRequest("Something went wrong, please try again!");
    await user.update(request.permitted);

    next(
      AppResponse.success({
        data: { user },
      })
    );
  })
);

module.exports = router;
