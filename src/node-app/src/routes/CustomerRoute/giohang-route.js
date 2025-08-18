const express = require("express");
const app = express();

const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");
const {
  getAllCartItems,
  addToCart,
  removeCartItem,
} = require("../../controller/CustomerController.js/giohangController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const KhachHangRoute = (app) => {
  router.post("/xem", getAllCartItems);
  router.post("/them", addToCart);
  // router.post("/remove-products", removeProductToCart);

  router.post("/xoa", removeCartItem);
  return app.use("/api/v1/giohang", router);
};

module.exports = KhachHangRoute;
