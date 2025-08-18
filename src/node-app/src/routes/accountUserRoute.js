const express = require("express");
const router = express.Router();
const TaikhoanController = require("../controller/TaikhoanController");

const AccountRoute = (app) => {
  router.post("/login/google", TaikhoanController.loginUserGoogle);
  router.post("/verify-admin", TaikhoanController.verifyAdmin);

  router.get("/user", TaikhoanController.getAll_taikhoanuser);
  return app.use("/api", router);
};

module.exports = AccountRoute;
