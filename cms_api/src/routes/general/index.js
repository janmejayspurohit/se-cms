const router = require("express").Router();
const asyncHandler = require("../../utils/async_handler");
const { AppResponse } = require("../../utils/app_response");

router.get(
  "/test",
  asyncHandler(async (request, _, next) => {
    next(
      AppResponse.success({
        data: {},
      })
    );
  })
);

module.exports = router;
