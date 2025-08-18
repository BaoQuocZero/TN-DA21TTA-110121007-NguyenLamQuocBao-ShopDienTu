const express = require("express");

const multer = require("multer");
const router = express.Router();

const { checkUserJWT } = require("../../middlewares/JWTAction.js");

const {
  dangky_new_taikhoan,
  dangnhap_taikhoan,
  suathongtin_matkhau_taikhoan,
  suathongtin_taikhoan,
  dangnhap_taikhoanGOOGLE,
  CapnhatAvatarUser,
  logoutTaikhoan,
  verifyAdmin,
  selectAll_PhanQuyen,
  update_PhanQuyen,
} = require("../../controller/TaikhoanController.js");

//multer---------------------------------------------------------------------
const { upload } = require("../../config/multerConfig.js");
//------------------------------------------------------------------------------

const CRUDTaiKhoan = (app) => {
  router.get("/protected", checkUserJWT, (req, res) => {
    res.json({ message: "Protected data", user: req.user }); // Sử dụng thông tin người dùng từ req.user
  });

  router.get("/phanquyen", selectAll_PhanQuyen);
  // Sửa tài khoản
  router.put("/sua/:TEN_DANG_NHAP", suathongtin_matkhau_taikhoan); //update mật khẩu
  router.put("/suathongtin/:TEN_DANG_NHAP", suathongtin_taikhoan); // update tài khoản gồm TEN_KHACH_HANG, DIA_CHI,
  router.put(
    "/suaavatar/:TEN_DANG_NHAP",
    upload.single("ANH_SP"),
    CapnhatAvatarUser
  ); // Cập nhật avatar nếu có
  //đăng nhập đăng ký đăng xuất
  router.post("/dangky", dangky_new_taikhoan);
  router.post("/dangnhap", dangnhap_taikhoan);
  router.post("/dangnhapgoogle", dangnhap_taikhoanGOOGLE);

  router.post("/logout", logoutTaikhoan);
  router.post("/verify-admin", verifyAdmin);

  router.post("/updatePhanQuyen", update_PhanQuyen);
  return app.use("/api/v1/admin/taikhoan", router);
};

module.exports = CRUDTaiKhoan;
