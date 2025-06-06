const express = require("express");
const router = express.Router();
const {
  getChiTietHoaDon,
  getChiTietHoaDonTheoNguoiDung_Success,
  getChiTietHoaDonTheoNguoiDung_Cancel,
  getPaidOrdersAwaitingProcessing,
  getChiTietHoaDonTheoNguoiDung_WaitingThanhToan,
  addReviewAndComment,

  //
  getAllChiTietHoaDon_Admin,
  getALLPaidOrdersAwaitingProcessing_Admin,
  getALLChiTietHoaDonTheoNguoiDung_Cancel_Admin,
  getAllChiTietHoaDonTheoNguoiDung_Success_Admin,
  getALLPaidOrders_DangGiaoHang_Admin,
  getPaidOrdersDangGiaoHang_ByUser,
  getChiTietHoaDonTheoThoiGian,
} = require("../../controller/AdminController/chiTietHoaDonController");

// ----------Admin----------------------------

router.get("/all", getAllChiTietHoaDon_Admin);
router.get("/all-success", getAllChiTietHoaDonTheoNguoiDung_Success_Admin);
router.get("/all-cancel", getALLChiTietHoaDonTheoNguoiDung_Cancel_Admin);

router.get("/all-process", getALLPaidOrdersAwaitingProcessing_Admin);
router.get("/all-dang-giao", getALLPaidOrders_DangGiaoHang_Admin);
router.post("/all-excel", getChiTietHoaDonTheoThoiGian);

// --------User ---------------------------------

// Lấy chi tiết hóa đơn theo ID
router.get("/:id", getChiTietHoaDon);

// Lấy các giao dịch thành công theo người dùng
router.get("/giao-dich-thanh-cong/:id", getChiTietHoaDonTheoNguoiDung_Success);

// Lấy các giao dịch đã bị hủy theo người dùng
router.get("/giao-dich-huy/:id", getChiTietHoaDonTheoNguoiDung_Cancel);

// Lấy danh sách các giao dịch đã thanh toán nhưng đang chờ xử lý
router.get("/dang-xu-ly/:id", getPaidOrdersAwaitingProcessing);
router.get("/dang-giao/:id", getPaidOrdersDangGiaoHang_ByUser);

// Lấy các giao dịch đang chờ thanh toán
router.get(
  "/cho-thanh-toan/:id",
  getChiTietHoaDonTheoNguoiDung_WaitingThanhToan
);

router.post("/danh-gia", addReviewAndComment);
module.exports = router;
