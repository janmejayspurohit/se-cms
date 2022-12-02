const router = require("express").Router();
const asyncHandler = require("../../utils/async_handler");
const { AppResponse } = require("../../utils/app_response");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const { User, Customer } = require("../../models");
const { HttpBadRequest } = require("../../custom_exceptions/http.error");

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

router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (request, _, next) => {
    const type = request.body.uploadType;
    const dataToInsert = [];
    await fs.readFile(request.file.destination + request.file.filename, "utf-8", async (err, data) => {
      if (err) return console.log(err);
      const objBody = data.split("\n");
      if (type === "user") {
        objBody.map((line) => {
          const user = line.split(",");
          const newUser = {
            name: user[0],
            email: user[1],
            address: user[2],
            gender: user[3],
            country_code: user[4],
            phone_number: user[5],
            password: user[6],
            status: user[7],
            role: user[8],
          };
          console.log(
            "🚀 -> file: index.js:46 -> Object.values(newUser)",
            Object.values(newUser).some((u) => !u)
          );
          if (Object.values(newUser).some((u) => !u)) return new HttpBadRequest("Invalid data");
          dataToInsert.push(newUser);
        });
      } else if (type === "customer") {
        objBody.map((line) => {
          const customer = line.split(",");
          const newCustomer = {
            company_name: customer[0],
            address: customer[1],
            incharge: 1,
            phone_number: customer[2],
          };
          if (Object.values(newCustomer).some((c) => !c)) return new HttpBadRequest("Invalid data");
          dataToInsert.push(newCustomer);
        });
      }
      if (type === "user") await User.bulkCreate(dataToInsert);
      else if (type === "customer") await Customer.bulkCreate(dataToInsert);
      next(
        AppResponse.success({
          data: {},
        })
      );
    });
  })
);

module.exports = router;
