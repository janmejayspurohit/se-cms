const router = require("express").Router();
const asyncHandler = require("../../utils/async_handler");
const { AppResponse } = require("../../utils/app_response");
const { HttpBadRequest } = require("../../custom_exceptions/http.error");

//MODELS
const { Bug, User, Project } = require("../../models");

//MIDDLEWARES
const { createBugValidationMiddleware } = require("./validation");
const PaginatedModel = require("../../models/paginated_model");

router.get(
  "/",
  asyncHandler(async (request, _, next) => {
    const {
      query: { page = 0, size = 10 },
    } = request;
    let where = null;
    if (request.authUser.role == User.ROLES.USER) {
      where = {
        [Op.or]: [{ assigned_engineers: { [Op.contains]: [request.authUser.id] } }, { project_manager: request.authUser.id }],
      };
    }
    const {
      size: sizeValue,
      page: pageValue,
      pageCount,
      items: bugs,
      total: totalCount,
    } = await PaginatedModel(
      Bug,
      {
        include: [
          {
            model: Project,
            as: "project",
            where,
          },
        ],
        order: [["created_at", "ASC"]],
      },
      { page, size }
    );

    if (!bugs) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { bugs, page: pageValue, pageCount, size: sizeValue, total: totalCount },
      })
    );
  })
);

router.post(
  "/",
  createBugValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const bug = await Bug.create(request.permitted);
    if (!bug) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { bug },
      })
    );
  })
);

router.get(
  "/:id",
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const bug = await Bug.findByPk(id);

    if (!bug) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { bug },
      })
    );
  })
);

router.put(
  "/:id",
  createBugValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const bug = await Bug.findByPk(id);

    if (!bug) throw new HttpBadRequest("Something went wrong, please try again!");

    await bug.update(request.permitted);

    next(
      AppResponse.success({
        data: { bug },
      })
    );
  })
);

router.delete(
  "/:id",
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const bug = await Bug.findByPk(id);

    if (!bug) throw new HttpBadRequest("Something went wrong, please try again!");

    await bug.destroy();

    next(
      AppResponse.success({
        data: {},
      })
    );
  })
);

module.exports = router;
