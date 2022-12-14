const { User } = require("../models");
const { AppResponse } = require("../utils/app_response");
const authenticateMiddleware = require("../middlewares/authenticate");

const authRouter = require("./auth");
const usersRouter = require("./users");
const generalRouter = require("./general");
const techsRouter = require("./techs");
const projectsRouter = require("./projects");
const customersRouter = require("./customers");
const meetingsRouter = require("./meetings");
const bugsRouter = require("./bugs");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    message: "π¦πβ¨Hello World!πβ¨π¦",
  });
});

router.get("/me", authenticateMiddleware, async (request, _, next) => {
  const user = await User.findByPk(request.userId);
  next(AppResponse.success({ data: { user } }));
});

router.use("/auth", authRouter);
router.use("/general", generalRouter);
router.use("/users", authenticateMiddleware, usersRouter);
router.use("/techs", authenticateMiddleware, techsRouter);
router.use("/projects", authenticateMiddleware, projectsRouter);
router.use("/customers", authenticateMiddleware, customersRouter);
router.use("/meetings", authenticateMiddleware, meetingsRouter);
router.use("/bugs", authenticateMiddleware, bugsRouter);

module.exports = router;
