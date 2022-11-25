const router = require("express").Router();
const asyncHandler = require("../../utils/async_handler");
const { AppResponse } = require("../../utils/app_response");
const { HttpBadRequest } = require("../../custom_exceptions/http.error");

//MODELS
const { Customer } = require("../../models");

//MIDDLEWARES
const { createCustomerValidationMiddleware } = require("./validation");
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
      items: customers,
      total: totalCount,
    } = await PaginatedModel(Customer, { order: [["created_at", "ASC"]] }, { page, size });

    if (!customers) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { customers, page: pageValue, pageCount, size: sizeValue, total: totalCount },
      })
    );
  })
);

router.get(
  "/all",
  asyncHandler(async (request, _, next) => {
    const customers = await Customer.findAll({ order: [["created_at", "ASC"]] });
    if (!customers) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { customers },
      })
    );
  })
);

router.post(
  "/",
  createCustomerValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const customer = await Customer.create(request.permitted);
    if (!customer) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { customer },
      })
    );
  })
);

router.get(
  "/:id",
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const customer = await Customer.findByPk(id);

    if (!customer) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { customer },
      })
    );
  })
);

router.put(
  "/:id",
  createCustomerValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const customer = await Customer.findByPk(id);

    if (!customer) throw new HttpBadRequest("Something went wrong, please try again!");

    await customer.update(request.permitted);

    next(
      AppResponse.success({
        data: { customer },
      })
    );
  })
);

module.exports = router;
