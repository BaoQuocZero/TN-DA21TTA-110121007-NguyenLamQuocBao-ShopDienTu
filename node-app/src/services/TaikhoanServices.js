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

  const CODEADDRESS = 0;
  const ISDELETE = false;
  const ID_ROLE = 2;

  try {
    // Kiểm tra định dạng email
    const checkmail = isValidEmail(dataTaiKhoan.EMAIL);
    if (!checkmail) {
      return {
        EM: "Định dạng mail không đúng",
        EC: 0,
        DT: [],
      };
    }

    // Kiểm tra email đã tồn tại chưa
    const [results_tendangnhap] = await pool.execute(
      "SELECT * FROM `user` WHERE `EMAIL` = ?",
      [dataTaiKhoan.EMAIL]
    );

    if (results_tendangnhap.length > 0) {
      return {
        EM: "Tài khoản đã tồn tại, không thể tạo thêm",
        EC: 0,
        DT: [],
      };
    }

    // Mã hóa mật khẩu
    let hashpass = await hashPassword(dataTaiKhoan.PASSWORD);

    // Thêm vào bảng user
    const [results] = await pool.execute(
      `INSERT INTO user (ID_ROLE, EMAIL, FIRSTNAME, LASTNAME, PHONENUMBER, CODEADDRESS, ADDRESS, PASSWORD, ISDELETE)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ID_ROLE,
        dataTaiKhoan.EMAIL,
        dataTaiKhoan.FIRSTNAME,
        dataTaiKhoan.LASTNAME,
        dataTaiKhoan.PHONENUMBER,
        CODEADDRESS,
        dataTaiKhoan.ADDRESS,
        hashpass,
        ISDELETE,
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
      EM: "Lỗi hệ thống khi tạo tài khoản",
      EC: -1,
      DT: [],
    };
  }
};

//đăng nhập
const LoginTaikhoan = async (EMAIL, PASSWORD) => {
  try {
    const [results] = await pool.execute(
      "SELECT * FROM user WHERE EMAIL = ?",
      [EMAIL]
    );

    // console.log("EMAIL: ", EMAIL);
    // console.log("Query results: ", results);

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
      user.ISDELETE === 1 ||
      user.ISDELETE === "" ||
      user.ISDELETE === null ||
      user.ISDELETE === "1"
    ) {
      return {
        EM: "Tài khoản bị khóa",
        EC: 0,
        DT: [],
      };
    }

    if (!user.PASSWORD) {
      return {
        EM: "Tài khoản chưa đặt mật khẩu vui lòng đăng nhập bằng Google",
        EC: -1,
        DT: [],
      };
    }

    // Kiểm tra mật khẩu
    const isCorrectPass = await bcrypt.compare(PASSWORD, user.PASSWORD);

    if (isCorrectPass) {
      let payload = {
        ID_USER: user.ID_USER,
        taikhoan: user.EMAIL,
        tenkhachhang: user.FIRSTNAME,
        LASTNAME: user.LASTNAME,
        PHONENUMBER: user.PHONENUMBER,
        ADDRESS: user.ADDRESS,
      };
      let token = createJWT(payload);
      return {
        EM: "Đăng nhập thành công",
        EC: 1,
        DT: {
          access_token: token,
          userInfo: user,
        },
      };
    } else {
      return {
        EM: "Đăng nhập thất bại, Email hoặc mật khẩu không đúng",
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
const LoginTaikhoanwithGOOGLE = async (EMAIL, PASSWORD) => {
  try {
    if (!EMAIL) {
      return {
        EM: "Email is required",
        EC: 400,
        DT: [],
      };
    }

    // Kiểm tra tài khoản trong database
    const [results] = await pool.query(
      "SELECT * FROM `user` WHERE `EMAIL` = ?",
      [EMAIL]
    );

    if (results.length > 0) {
      // Kiểm tra trạng thái người dùng
      const user = results[0];
      if (
        user.ISDELETE === 1 ||
        user.ISDELETE === "" ||
        user.ISDELETE === null ||
        user.ISDELETE === "1"
      ) {
        return {
          EM: "Tài khoản bị khóa",
          EC: 0,
          DT: [],
        };
      }

      let payload = {
        ID_USER: user.ID_USER,
        taikhoan: user.EMAIL,
        tenkhachhang: user.FIRSTNAME,
        LASTNAME: user.LASTNAME,
        PHONENUMBER: user.PHONENUMBER,
        ADDRESS: user.ADDRESS,
      };
      let token = createJWT(payload);

      return {
        EM: "Đăng nhập thành công",
        EC: 200,
        DT: {
          accessToken: token,
          userInfo: user,
        },
      };
    } else {

      const CODEADDRESS = 0;
      const ISDELETE = false;
      const ID_ROLE = 2;

      const [insertResult] = await pool.query(
        "INSERT INTO `user` (ID_ROLE, EMAIL, CODEADDRESS, ISDELETE) VALUES (?, ?, ?, ?)",
        [ID_ROLE, EMAIL, CODEADDRESS, ISDELETE]
      );

      const [newUser] = await pool.query(
        "SELECT * FROM `user` WHERE `ID_USER` = ?",
        [insertResult.insertId]
      );

      let payload = {
        taikhoan: newUser[0].EMAIL,
        tenkhachhang: newUser[0].FIRSTNAME,
        LASTNAME: newUser[0].LASTNAME,
        PHONENUMBER: newUser[0].PHONENUMBER,
        ADDRESS: newUser[0].ADDRESS,
      };
      let token = createJWT(payload);

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
    console.log("verify_adminService token", token.token);
    // Giải mã token để lấy thông tin tài khoản
    const decoded = jwt.verify(token.token, process.env.SECRETKEYADMIN);
    const taikhoan = decoded.taikhoan;

    // Truy vấn cơ sở dữ liệu để lấy thông tin người dùng
    const [results, fields] = await pool.execute(
      "SELECT * FROM `user` WHERE `EMAIL` = ?",
      [taikhoan]
    );

    // return {
    //   EM: "Kiểm tra thành công !!!",
    //   EC: 1,
    //   DT: "Admin",
    // };

    if (results.length > 0) {
      const user = results[0];
      // Kiểm tra quyền Admin
      if (user.ID_ROLE === 1) {
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
