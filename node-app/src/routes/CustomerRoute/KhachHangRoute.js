const express = require("express");
const app = express();

const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");
const {
    Xem_ThongTin_KhachHang_MA_KH,
    Sua_ThongTin_KhachHang_MA_KH,
    updateAvatarController,
} = require("../../controller/CustomerController.js/KhachHangController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const KhachHangRoute = (app) => {
    router.post("/xem/thongtin", Xem_ThongTin_KhachHang_MA_KH);
    router.post("/sua/thongtin", Sua_ThongTin_KhachHang_MA_KH);
    router.put("/:id/avatar", upload.single("images"), updateAvatarController);

    return app.use("/api/v1/KhachHang", router);
};

module.exports = KhachHangRoute;
