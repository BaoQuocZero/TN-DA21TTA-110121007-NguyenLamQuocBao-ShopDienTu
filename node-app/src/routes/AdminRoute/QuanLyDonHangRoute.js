const express = require("express");
const app = express();

const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");

const {
  Xem_DonHangController,
} = require("../../controller/AdminController/QuanLyDonHangController.js");
//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const QuanLyDonHangRoute = (app) => {
  router.get("/xemtatca", Xem_DonHangController);
  router.post("/them");
  router.put("/sua");
  router.delete("/xoa");

  return app.use("/api/v1/admin/quanlydonhang", router);
};

module.exports = QuanLyDonHangRoute;
