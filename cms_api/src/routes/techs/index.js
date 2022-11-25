const router = require("express").Router();
const asyncHandler = require("../../utils/async_handler");
const { AppResponse } = require("../../utils/app_response");
const { HttpBadRequest } = require("../../custom_exceptions/http.error");

//MODELS
const { Tech } = require("../../models");

//MIDDLEWARES
const { createTechValidationMiddleware } = require("./validation");
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
      items: techs,
      total: totalCount,
    } = await PaginatedModel(Tech, { order: [["created_at", "ASC"]] }, { page, size });

    if (!techs) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { techs, page: pageValue, pageCount, size: sizeValue, total: totalCount },
      })
    );
  })
);

router.get(
  "/active",
  asyncHandler(async (request, _, next) => {
    const techs = await Tech.findAll({ where: { is_active: true } });
    if (!techs) throw new HttpBadRequest("Something went wrong, please try again!");
    next(AppResponse.success({ data: techs }));
  })
);

router.post(
  "/",
  createTechValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const tech = await Tech.create(request.permitted);
    if (!tech) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { tech },
      })
    );
  })
);

router.get(
  "/:id",
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const tech = await Tech.findByPk(id);

    if (!tech) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { tech },
      })
    );
  })
);

router.put(
  "/:id",
  createTechValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const tech = await Tech.findByPk(id);

    if (!tech) throw new HttpBadRequest("Something went wrong, please try again!");

    await tech.update(request.permitted);

    next(
      AppResponse.success({
        data: { tech },
      })
    );
  })
);

module.exports = router;
