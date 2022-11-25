const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require("dotenv").config();
const router = require("./routes");
const { SendResponse } = require("./utils/app_response");

// Setup
app.use(morgan("common"));
app.use(
  cors({
    // origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());
app.set("json replacer", (k, v) => (v === null || v === "" ? undefined : v));

// All routes defined here
app.use(router);

// If no routes found
app.use((req, res, next) => {
  const error = new Error("Not Found - " + req.originalUrl);
  error.statusCode = 404;
  next(error);
});

// Response handler
app.use((appResponse, _, res, __) => {
  const response = SendResponse(appResponse);
  res.status(appResponse.statusCode || 500).json(response);
});

const port = process.env.PORT || 8080;
app.listen(port, (e) => {
  if (e) console.log(e);
  console.log("Listening on port", port);
});
