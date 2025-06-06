const express = require("express");
const app = express();

const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");

const {
  tao_new_theloai,
  xem_theloai_voi_id,
  xemtatca_theloai,
  sua_theloai_voi_id,
  xoa_theloai_voi_id,
} = require("../../controller/AdminController/categoryController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const CRUDTheLoai = (app) => {
  router.post("/tao", tao_new_theloai);
  router.get("/xemtatca", xemtatca_theloai);

  router.post("/xemid", xem_theloai_voi_id);
  router.put("/sua/:MATL", sua_theloai_voi_id);
  router.delete("/xoa/", xoa_theloai_voi_id);
  return app.use("/api/v1/admin/theloai", router);
};

module.exports = CRUDTheLoai;
