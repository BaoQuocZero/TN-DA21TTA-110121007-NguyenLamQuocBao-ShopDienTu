const express = require("express");
const app = express();

const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");

const {
  tao_new_sanpham,
  xem_sanpham_voi_id,
  xemtatca_sanpham,
  sua_sanpham_voi_id,
  xoa_sanpham_voi_id,
  getAllUseSanPham,
  getSanPhamByTheLoai_Action,
  getSanPhamByAdventure,
  getSanPhamByRPG,
  getSanPhamBySimulation,
  get5BestSellingProducts,
  get5TopFavoriteProducts,
  get5BestExpensiveProducts,
  getCartTotalQuantity,
  get2LatestProducts,
  searchSanPhamDynamic,
} = require("../../controller/AdminController/productController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const CRUDSanpham = (app) => {
  router.put("/sua/:MASP", upload.single("GALLERYPRODUCT_DETAILS"), sua_sanpham_voi_id);
  router.post("/tao", upload.single("GALLERYPRODUCT_DETAILS"), tao_new_sanpham);

  router.post("/xem-id", xem_sanpham_voi_id);
  router.get("/adventure", getSanPhamByAdventure);
  router.get("/action", getSanPhamByTheLoai_Action);
  router.get("/rpg", getSanPhamByRPG);
  router.get("/last2Products", get2LatestProducts);

  router.get("/simulation", getSanPhamBySimulation);
  router.get("/use/5best-selling", get5BestSellingProducts);
  router.get("/use/5best-favorite", get5TopFavoriteProducts);
  router.get("/use/5best-expensive", get5BestExpensiveProducts);

  router.get("/xemtatca", xemtatca_sanpham);
  router.get("/xem/use", getAllUseSanPham);

  router.delete("/xoa/:MASP", xoa_sanpham_voi_id);
  router.get("/total-quantity/:id", getCartTotalQuantity);
  router.get("/search/name", searchSanPhamDynamic);
  return app.use("/api/v1/admin/sanpham/", router);
};

module.exports = CRUDSanpham;
