const express = require("express");
const app = express();

const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");

const {
  tao_new_giamgia,
  xemtatca_giamgia,
  xem_giamgia_voi_id,
  sua_giamgia_voi_id,
  xoa_giamgia_voi_id,
} = require("../../controller/AdminController/giamgiaController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const CRUDGiamgia = (app) => {
  router.post("/tao", tao_new_giamgia);
  router.get("/xemtatca", xemtatca_giamgia);
  router.post("/xemid", xem_giamgia_voi_id);
  router.put("/sua/:MA_GIAM_GIA", sua_giamgia_voi_id);
  router.delete("/xoa", xoa_giamgia_voi_id);
  return app.use("/api/v1/admin/giamgia", router);
};

module.exports = CRUDGiamgia;
