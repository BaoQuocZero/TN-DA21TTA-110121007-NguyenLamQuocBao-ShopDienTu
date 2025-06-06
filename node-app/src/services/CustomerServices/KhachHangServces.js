const pool = require("../../config/database");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRETKEYADMIN;
const path = require("path");
const { createJWT } = require("../../middlewares/JWTAction");
const Servces_xem_ThongTin_KhachHang_MA_KH = async (MA_KH) => {
  try {
    let [khachhang] = await pool.execute(
      "SELECT * FROM khachhang WHERE MA_KH = ?",
      [MA_KH]
    );

    if (khachhang.length === 0) {
      return {
        EM: "Không tìm thấy khách hàng này",
        EC: 0,
        DT: [],
      };
    }

    return {
      EM: "Xem thông tin khách hàng thành công",
      EC: 1,
      DT: khachhang,
    };
  } catch (error) {
    return {
      EM: "lỗi services Servces_xem_ThongTin_KhachHang_MA_KH",
      EC: -1,
      DT: [],
    };
  }
};

const Servces_Sua_ThongTin_KhachHang_MA_KH = async (KhachHang) => {
  try {
    console.log("KhachHang", KhachHang);
    // Kiểm tra sự tồn tại của khách hàng trước
    let [khachhang] = await pool.execute(
      "SELECT * FROM khachhang WHERE MA_KH = ?",
      [KhachHang.MA_KH]
    );

    if (khachhang.length === 0) {
      return {
        EM: "Không tìm thấy khách hàng này",
        EC: 0,
        DT: [],
      };
    }

    // Tạo các trường và giá trị cho câu lệnh UPDATE
    const updateFields = [];
    const updateValues = [];

    for (let key in KhachHang) {
      if (key !== "MA_KH" && KhachHang[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(KhachHang[key]);
      }
    }

    // Nếu không có trường nào để cập nhật, trả về lỗi
    if (updateFields.length === 0) {
      return {
        EM: "Không có trường nào để cập nhật",
        EC: 0,
        DT: [],
      };
    }

    // Thêm giá trị MA_KH vào cuối mảng để dùng cho WHERE
    updateValues.push(KhachHang.MA_KH);

    // Ghép câu lệnh SQL
    const sqlUpdate = `UPDATE khachhang SET ${updateFields.join(
      ", "
    )} WHERE MA_KH = ?`;

    // Thực hiện cập nhật
    await pool.execute(sqlUpdate, updateValues);

    // Lấy thông tin tài khoản từ `TEN_DANG_NHAP`
    const [results] = await pool.query(
      "SELECT * FROM `khachhang` WHERE `MA_KH` = ?",
      [KhachHang.MA_KH]
    );

    if (results.length === 0) {
      return {
        EM: "Không tìm thấy tài khoản",
        EC: 0,
        DT: [],
      };
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

    return {
      EM: "Cập nhật thông tin thành công",
      EC: 1,
      DT: {
        accessToken: token,
        userInfo: user,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Lỗi services Servces_Sua_ThongTin_KhachHang_MA_KH",
      EC: -1,
      DT: [],
    };
  }
};

module.exports = {
  Servces_xem_ThongTin_KhachHang_MA_KH,
  Servces_Sua_ThongTin_KhachHang_MA_KH,
};
