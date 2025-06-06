const {
  Servces_xem_ThongTin_KhachHang_MA_KH,
  Servces_Sua_ThongTin_KhachHang_MA_KH,
} = require("../../services/CustomerServices/KhachHangServces");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRETKEYADMIN;
const { createJWT } = require("../../middlewares/JWTAction");
const path = require("path");
const pool = require("../../config/database");
const Xem_ThongTin_KhachHang_MA_KH = async (req, res) => {
  try {
    const MA_KH = req.body.MA_KH;
    let results = await Servces_xem_ThongTin_KhachHang_MA_KH(MA_KH);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: -1,
      DT: null,
    });
  }
};

const Sua_ThongTin_KhachHang_MA_KH = async (req, res) => {
  try {
    const KhachHang = req.body;
    let results = await Servces_Sua_ThongTin_KhachHang_MA_KH(KhachHang);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: -1,
      DT: null,
    });
  }
};
const updateAvatarController = async (req, res) => {
  try {
    const { id } = req.params; // `id` đại diện cho `MA_KH`

    const avatarFile = req.file ? path.basename(req.file.path) : avatar;

    // Kiểm tra xem khách hàng có tồn tại không
    const [khachhang] = await pool.execute(
      "SELECT * FROM khachhang WHERE MA_KH = ?",
      [id]
    );

    console.log("khachhang", khachhang);
    if (khachhang.length === 0) {
      return res.status(404).json({
        EM: "Không tìm thấy khách hàng",
        EC: 0,
        DT: [],
      });
    }

    // Cập nhật avatar trong database
    await pool.execute("UPDATE khachhang SET AVATAR = ? WHERE MA_KH = ?", [
      avatarFile,
      id,
    ]);

    // Lấy thông tin tài khoản từ `TEN_DANG_NHAP`
    const [results] = await pool.query(
      "SELECT * FROM `khachhang` WHERE `MA_KH` = ?",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        EM: "Không tìm thấy tài khoản",
        EC: 0,
        DT: [],
      });
    }

    // Tạo token JWT nếu tài khoản tồn tại
    const user = results[0];
    const token = createJWT(
      {
        MA_KH: user.MA_KH,
        MA_PHAN_QUYEN: user.MA_PHAN_QUYEN,
        DIA_CHI: user.DIA_CHI,
        SDT_KH: user.SDT_KH,
        GHI_CHU_KH: user.GHI_CHU_KH,
        DIA_CHI_Provinces: user.DIA_CHI_Provinces,
        DIA_CHI_Wards: user.DIA_CHI_Wards,
        DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
        DIA_CHI_Districts: user.DIA_CHI_Districts,
        TEN_DANG_NHAP: user.TEN_DANG_NHAP,
        TEN_KHACH_HANG: user.TEN_KHACH_HANG,
        AVATAR: user.AVATAR,
        NGAY_SINH: user.NGAY_SINH,
        TRANG_THAI_NGUOI_DUNG: user.TRANG_THAI_NGUOI_DUNG,
      },
      JWT_SECRET,
      { expiresIn: "5h" }
    );

    return res.status(200).json({
      EM: "Cập nhật avatar thành công",
      EC: 1,
      DT: {
        accessToken: token,
        userInfo: user,
      },
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật avatar",
      EC: 0,
      DT: [],
    });
  }
};

module.exports = {
  Xem_ThongTin_KhachHang_MA_KH,
  Sua_ThongTin_KhachHang_MA_KH,
  updateAvatarController,
};
