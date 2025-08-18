const express = require("express");
const app = express();

const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");

const {
  tao_new_thanh_toan,
  xem_thanh_toan_voi_id,
  xemtatca_thanh_toan,
  sua_thanh_toan_voi_id,
  xoa_thanh_toan_voi_id,
  getTHANH_TOAN_Use,
} = require("../../controller/AdminController/thanhtoanController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const CRUDThanhToan = (app) => {
  router.get("/use", getTHANH_TOAN_Use);
  router.post("/tao", tao_new_thanh_toan);
  router.get("/xemtatca", xemtatca_thanh_toan);
  router.post("/xemid", xem_thanh_toan_voi_id);

  router.put("/sua/:MA_THANH_TOAN", sua_thanh_toan_voi_id);
  router.delete("/xoa/:MA_THANH_TOAN", xoa_thanh_toan_voi_id);
  return app.use("/api/v1/admin/thanhtoan", router);
};

module.exports = CRUDThanhToan;
