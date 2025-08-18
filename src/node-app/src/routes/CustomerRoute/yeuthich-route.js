const express = require("express");
const app = express();

const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");
const {
  taoSanphamYeuthich,
  xemSanphamYeuthichcuabanthan,
  xoaSanphamYeuthichcuabanthan,
  addCartRemoveWish,
  checkProductStatus,
} = require("../../controller/CustomerController.js/yeuthichController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const KhachHangRoute = (app) => {
  router.post("/xem", xemSanphamYeuthichcuabanthan);
  router.post("/them", taoSanphamYeuthich);
  router.post("/add-cart/delete-wish", addCartRemoveWish);

  router.post("/xoa", xoaSanphamYeuthichcuabanthan);
  router.post("/check-product-status", checkProductStatus); // Route mới
  return app.use("/api/v1/yeuthich", router);
};

module.exports = KhachHangRoute;
