const pool = require("../config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const { createJWT } = require("../middlewares/JWTAction");
const jwt = require("jsonwebtoken");
//hàm hash mật khẩu
const hashPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  //let check = bcrypt.compareSync(password, hashPassword);
  return hashPassword;
};
//hàm ktr mật khẩu đã hash
const checkPassword = (inputpassword, hashpass) => {
  return bcrypt.compareSync(inputpassword, hashpass);
};

function isValidEmail(email) {
  // Biểu thức chính quy để kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//đăng ký với tên đăng nhập
const isValidEmail2 = (email) => {
  // Biểu thức chính quy để kiểm tra email hợp lệ
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const Dangky_TaiKhoan = async (dataTaiKhoan) => {
  dataTaiKhoan = dataTaiKhoan.infoUser;
  const GHI_CHU_KH = 1; // ở đây là 1 mới đúng nha
  const MA_PHAN_QUYEN = 2;
  try {
    const checkmail = isValidEmail(dataTaiKhoan.TEN_DANG_NHAP);
    if (!checkmail) {
      return {
        EM: "Định dạng mail không đúng",
        EC: 0,
        DT: [],
      };
    }

    const [results_tendangnhap, fields_tendangnhap] = await pool.execute(
      "SELECT * FROM `khachhang` WHERE `TEN_DANG_NHAP` = ?",
      [dataTaiKhoan.TEN_DANG_NHAP]
    );

    if (results_tendangnhap.length > 0) {
      return {
        EM: "Tài khoản đã tồn tại không thể tạo thêm",
        EC: 0,
        DT: [],
      };
    }

    let hashpass = await hashPassword(dataTaiKhoan.MAT_KHAU);

    let [results, fields] = await pool.execute(
      `INSERT INTO khachhang (MA_PHAN_QUYEN, TEN_DANG_NHAP, TEN_KHACH_HANG, MAT_KHAU ,GHI_CHU_KH) VALUES (?, ?, ?, ?, ?)`,
      [
        MA_PHAN_QUYEN,
        dataTaiKhoan.TEN_DANG_NHAP,
        dataTaiKhoan.TEN_KHACH_HANG,
        hashpass,
        GHI_CHU_KH,
      ]
    );

    return {
      EM: "Tạo tài khoản thành công",
      EC: 1,
      DT: results,
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      EM: "lỗi services createTaiKhoan01",
      EC: 1,
      DT: [],
    };
  }
};

//đăng nhập
const LoginTaikhoan = async (TEN_DANG_NHAP, MAT_KHAU) => {
  try {
    const [results] = await pool.execute(
      "SELECT * FROM khachhang WHERE TEN_DANG_NHAP = ?",
      [TEN_DANG_NHAP]
    );

    console.log("TEN_DANG_NHAP: ", TEN_DANG_NHAP);
    console.log("Query results: ", results);

    if (results.length === 0) {
      return {
        EM: "Đăng nhập thất bại, tài khoản không đúng",
        EC: 0,
        DT: [],
      };
    }

    const user = results[0];

    // Kiểm tra trạng thái tài khoản
    if (
      user.GHI_CHU_KH === 0 ||
      user.GHI_CHU_KH === "" ||
      user.GHI_CHU_KH === null ||
      user.GHI_CHU_KH === "0"
    ) {
      return {
        EM: "Tài khoản bị khóa",
        EC: 0,
        DT: [],
      };
    }

    // Kiểm tra nếu MAT_KHAU không tồn tại
    if (!user.MAT_KHAU) {
      return {
        EM: "Lỗi: Không tìm thấy mật khẩu trong database",
        EC: -1,
        DT: [],
      };
    }

    // Kiểm tra mật khẩu
    const isCorrectPass = await bcrypt.compare(MAT_KHAU, user.MAT_KHAU);

    if (isCorrectPass) {
      let payload = {
        taikhoan: user.TEN_DANG_NHAP,
        tenkhachhang: user.TEN_KHACH_HANG,
      };
      let token = createJWT(payload);
      return {
        EM: "Đăng nhập thành công",
        EC: 1,
        DT: {
          access_token: token,
          data: user,
        },
      };
    } else {
      return {
        EM: "Đăng nhập thất bại, mật khẩu không đúng",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.error("Error in LoginTaikhoan:", error);
    return {
      EM: "Lỗi từ dịch vụ LoginTaikhoan",
      EC: -1,
      DT: [],
    };
  }
};

//đăng nhập google
const LoginTaikhoanwithGOOGLE = async (TEN_DANG_NHAP, TEN_KHACH_HANG) => {
  try {
    if (!TEN_DANG_NHAP) {
      return {
        EM: "Email is required",
        EC: 400,
        DT: [],
      };
    }

    // Kiểm tra tài khoản trong database
    const [results] = await pool.query(
      "SELECT * FROM `khachhang` WHERE `TEN_DANG_NHAP` = ?",
      [TEN_DANG_NHAP]
    );

    if (results.length > 0) {
      // Kiểm tra trạng thái người dùng
      const user = results[0];

      console.log("user", user);
      // Kiểm tra nếu tài khoản bị khóa
      if (
        user.GHI_CHU_KH === 0 ||
        user.GHI_CHU_KH === "" ||
        user.GHI_CHU_KH === null ||
        user.GHI_CHU_KH === "0"
      ) {
        return {
          EM: "Tài khoản đã bị khóa, không thể đăng nhập",
          EC: 0,
          DT: "Account is disabled",
        };
      }

      const token = createJWT({
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
      });

      return {
        EM: "Đăng nhập thành công",
        EC: 200,
        DT: {
          accessToken: token,
          userInfo: user,
        },
      };
    } else {
      // console.log("TRANG_THAI_NGUOI_DUNG: ", TRANG_THAI_NGUOI_DUNG)
      const MA_PHAN_QUYEN = 2;
      const GHI_CHU_KH = 1;
      const [insertResult] = await pool.query(
        "INSERT INTO `khachhang` (MA_PHAN_QUYEN, TEN_DANG_NHAP, TEN_KHACH_HANG, GHI_CHU_KH) VALUES (?, ?, ?, ?)",
        [MA_PHAN_QUYEN, TEN_DANG_NHAP, TEN_KHACH_HANG, GHI_CHU_KH]
      );

      const [newUser] = await pool.query(
        "SELECT * FROM `khachhang` WHERE `MA_KH` = ?",
        [insertResult.insertId]
      );

      const token = createJWT({
        MA_KH: newUser[0].MA_KH,
        MA_PHAN_QUYEN: newUser[0].MA_PHAN_QUYEN,
        DIA_CHI: newUser[0].DIA_CHI,
        SDT_KH: newUser[0].SDT_KH,
        GHI_CHU_KH: newUser[0].GHI_CHU_KH,
        DIA_CHI_Provinces: newUser[0].DIA_CHI_Provinces,
        DIA_CHI_Wards: newUser[0].DIA_CHI_Wards,
        DIA_CHI_STREETNAME: newUser[0].DIA_CHI_STREETNAME,
        DIA_CHI_Districts: newUser[0].DIA_CHI_Districts,
        TEN_DANG_NHAP: newUser[0].TEN_DANG_NHAP,
        TEN_KHACH_HANG: newUser[0].TEN_KHACH_HANG,
        AVATAR: newUser[0].AVATAR,
        NGAY_SINH: newUser[0].NGAY_SINH,
        TRANG_THAI_NGUOI_DUNG: newUser[0].TRANG_THAI_NGUOI_DUNG,
      });

      return {
        EM: "Tài khoản mới được tạo và đăng nhập thành công",
        EC: 200,
        DT: {
          accessToken: token,
          userInfo: newUser[0],
        },
      };
    }
  } catch (error) {
    console.error("Error in LoginTaikhoanwithGOOGLE:", error);
    return {
      EM: `Lỗi hệ thống: ${error.message}`,
      EC: 500,
      DT: [],
    };
  }
};

//update mật khẩu
const updateTaiKhoan_matkhau = async (TEN_DANG_NHAP, matKhaucu, matkhaumoi) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from khachhang where TEN_DANG_NHAP = ?",
      [TEN_DANG_NHAP]
    );
    if (results1.length > 0) {
      const isCorrectPass = await bcrypt.compare(
        matKhaucu,
        results1[0].MAT_KHAU
      );
      if (isCorrectPass) {
        let hashpass = await hashPassword(matkhaumoi);
        let [results, fields] = await pool.execute(
          `UPDATE khachhang SET MAT_KHAU = ? WHERE TEN_DANG_NHAP = ?`,
          [hashpass, TEN_DANG_NHAP]
        );
        return {
          EM: "update thành công",
          EC: 0,
          DT: [],
        };
      }
      return {
        EM: "mật khẩu cũ không khớp không thể update",
        EC: 0,
        DT: [],
      };
    }
    return {
      EM: "tài khoản không tồn tại",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    return {
      EM: "lỗi services createTaiKhoan",
      EC: 1,
      DT: [],
    };
  }
};

//update thông tin khách hàng
const updateTaiKhoan_thongtinkhachhang = async (
  TEN_DANG_NHAP,
  datakhachhang
) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from khachhang where TEN_DANG_NHAP = ?",
      [TEN_DANG_NHAP]
    );
    if (results1.length > 0) {
      let [results, fields] = await pool.execute(
        `UPDATE khachhang SET TEN_KHACH_HANG = ?, DIA_CHI = ?, SDT_KH = ? WHERE TEN_DANG_NHAP = ?`,
        [
          datakhachhang.TEN_KHACH_HANG,
          datakhachhang.DIA_CHI,
          datakhachhang.SDT_KH,
          TEN_DANG_NHAP,
        ]
      );
      return {
        EM: "update thành công",
        EC: 0,
        DT: [],
      };
    }
    return {
      EM: "tài khoản không tồn tại",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    return {
      EM: "lỗi services createTaiKhoan",
      EC: 1,
      DT: [],
    };
  }
};

//update avatar
const updateTaiKhoan_avatar = async (TEN_DANG_NHAP, AVATAR) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from khachhang where TEN_DANG_NHAP = ?",
      [TEN_DANG_NHAP]
    );
    if (results1.length > 0) {
      let [results, fields] = await pool.execute(
        `UPDATE khachhang SET AVATAR = ? WHERE TEN_DANG_NHAP = ?`,
        [AVATAR, TEN_DANG_NHAP]
      );
      return {
        EM: "update avatar thành công",
        EC: 0,
        DT: [],
      };
    }
    return {
      EM: "tài khoản không tồn tại",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    return {
      EM: "lỗi services createTaiKhoan",
      EC: 1,
      DT: [],
    };
  }
};

const verify_adminService = async (token) => {
  try {
    console.log("token", token.token);
    // Giải mã token để lấy thông tin tài khoản
    const decoded = jwt.verify(token.token, process.env.SECRETKEYADMIN);
    console.log("decoded", decoded);
    const TEN_DANG_NHAP = decoded.TEN_DANG_NHAP;

    // Truy vấn cơ sở dữ liệu để lấy thông tin người dùng
    const [results, fields] = await pool.execute(
      "SELECT * FROM `khachhang` WHERE `TEN_DANG_NHAP` = ?",
      [TEN_DANG_NHAP]
    );

    if (results.length > 0) {
      const user = results[0];
      // Kiểm tra quyền Admin
      if (user.MA_PHAN_QUYEN === 1) {
        return {
          EM: "Kiểm tra thành công !!!",
          EC: 1,
          DT: "Admin",
        };
      } else {
        return {
          EM: "Bạn không có quyền admin",
          EC: 1,
          DT: "User",
        };
      }
    } else {
      return {
        EM: "Người dùng không tồn tại",
        EC: 1,
        DT: null,
      };
    }
  } catch (error) {
    console.error("Error in verify_adminService:", error);
    return {
      EM: "error from server",
      EC: -1,
      DT: null,
    };
  }
};

module.exports = {
  Dangky_TaiKhoan,
  LoginTaikhoan,
  LoginTaikhoanwithGOOGLE,
  updateTaiKhoan_matkhau,
  updateTaiKhoan_thongtinkhachhang,
  updateTaiKhoan_avatar,

  verify_adminService,
};
