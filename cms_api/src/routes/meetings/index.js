const router = require("express").Router();
const asyncHandler = require("../../utils/async_handler");
const { AppResponse } = require("../../utils/app_response");
const { HttpBadRequest } = require("../../custom_exceptions/http.error");

//MODELS
const { Meeting, User, Project } = require("../../models");

//MIDDLEWARES
const { createMeetingValidationMiddleware } = require("./validation");
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
      items: meetings,
      total: totalCount,
    } = await PaginatedModel(
      Meeting,
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

    if (!meetings) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { meetings, page: pageValue, pageCount, size: sizeValue, total: totalCount },
      })
    );
  })
);

router.post(
  "/",
  createMeetingValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const meeting = await Meeting.create(request.permitted);
    if (!meeting) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { meeting },
      })
    );
  })
);

router.get(
  "/:id",
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const meeting = await Meeting.findByPk(id);

    if (!meeting) throw new HttpBadRequest("Something went wrong, please try again!");

    next(
      AppResponse.success({
        data: { meeting },
      })
    );
  })
);

router.put(
  "/:id",
  createMeetingValidationMiddleware,
  asyncHandler(async (request, _, next) => {
    const { id } = request.params;
    const meeting = await Meeting.findByPk(id);

    if (!meeting) throw new HttpBadRequest("Something went wrong, please try again!");

    await meeting.update(request.permitted);

    next(
      AppResponse.success({
        data: { meeting },
      })
    );
  })
);

module.exports = router;
