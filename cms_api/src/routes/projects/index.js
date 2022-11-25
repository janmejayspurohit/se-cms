const router = require("express").Router();
const asyncHandler = require("../../utils/async_handler");
const { AppResponse } = require("../../utils/app_response");
const { HttpBadRequest } = require("../../custom_exceptions/http.error");

//MODELS
const { Project, User } = require("../../models");

//MIDDLEWARES
const { createProjectValidationMiddleware } = require("./validation");
const PaginatedModel = require("../../models/paginated_model");
const { Op } = require("sequelize");

router.get(
  "/",
  asyncHandler(async (request, _, next) => {
    const {
      query: { page = 0, size = 10 },
    } = request;
    let where = null;
    if (request.authUser.role == User.ROLES.ADMIN) {
    } else if (request.authUser.role == User.ROLES.USER) {
      where = {
        [Op.or]: [{ assigned_engineers: { [Op.contains]: [request.authUser.id] } }, { project_manager: request.authUser.id }],
      };
    } else return HttpBadRequest("Something went wrong, please try again!");

    const {
      size: sizeValue,
      page: pageValue,
      pageCount,
      items: projects,
      total: totalCount,
    } = await PaginatedModel(
      Project,
      {
        where,
        order: [["created_at", "ASC"]],
      },
      { page, size }
    );

    if (!projects) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { projects, page: pageValue, pageCount, size: sizeValue, total: totalCount },
      })
    );
  })
);

router.get(
  "/active",
  asyncHandler(async (request, _, next) => {
    const projects = await Project.findAll({ where: { is_active: true } });
    if (!projects) throw new HttpBadRequest("Something went wrong, please try again!");
    next(AppResponse.success({ data: projects }));
  })
);

router.post(
  "/",
  createProjectValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const project = await Project.create(request.permitted);
    if (!project) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { project },
      })
    );
  })
);

router.get(
  "/:id",
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const project = await Project.findByPk(id);

    if (!project) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { project },
      })
    );
  })
);

router.put(
  "/:id",
  createProjectValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const project = await Project.findByPk(id);

    if (!project) throw new HttpBadRequest("Something went wrong, please try again!");

    await project.update(request.permitted);

    next(
      AppResponse.success({
        data: { project },
      })
    );
  })
);

module.exports = router;
