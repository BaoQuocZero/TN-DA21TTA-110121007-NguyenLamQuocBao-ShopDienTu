const express = require("express");
const app = express();

const router = express.Router();

const {
  tao_new_sanpham_uutien,
  xem_sanpham_uutien_voi_id,
  xemtatca_sanpham_uutien,
  sua_sanpham_uutien_voi_id,
  xoa_sanpham_uutien_voi_id,
} = require("../../controller/AdminController/sanphamUTController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//--------------------------------------------------------------------------

const CRUDSanphamUutien = (app) => {
  // Tạo sản phẩm ưu tiên mới
  router.post(
    "/tao",
    upload.fields([
      { name: "HINH_ANH_BIA", maxCount: 1 },
      { name: "HINH_ANH_LOGO", maxCount: 1 },
      { name: "HINH_ANH_NAVBAR", maxCount: 1 },
    ]),
    tao_new_sanpham_uutien
  );
  // Xem tất cả sản phẩm ưu tiên
  router.get("/xemtatca", xemtatca_sanpham_uutien);

  // Xem sản phẩm ưu tiên theo ID
  router.get("/xem/:MASANPHAMUUTIEN", xem_sanpham_uutien_voi_id);

  // Sửa sản phẩm ưu tiên theo ID
  router.put("/sua/:MASANPHAMUUTIEN", sua_sanpham_uutien_voi_id);

  // Xóa sản phẩm ưu tiên theo ID
  router.delete("/xoa/:MASANPHAMUUTIEN", xoa_sanpham_uutien_voi_id);

  // Đường dẫn API
  return app.use("/api/v1/admin/sanphamuutien", router);
};

module.exports = CRUDSanphamUutien;
