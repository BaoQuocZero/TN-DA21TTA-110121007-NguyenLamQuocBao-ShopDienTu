const pool = require("../../config/database");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRETKEYADMIN;
const path = require("path");
const { createJWT } = require("../../middlewares/JWTAction");
const Servces_xem_ThongTin_KhachHang_MA_KH = async (ID_USER) => {
  try {
    let [khachhang] = await pool.execute(
      "SELECT * FROM user WHERE ID_USER = ?",
      [ID_USER]
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

const Servces_Sua_ThongTin_KhachHang_MA_KH = async (UserData) => {
  try {
    // 1. Kiểm tra user tồn tại
    let [userCheck] = await pool.execute(
      "SELECT * FROM `user` WHERE ID_USER = ? AND ISDELETE = 0",
      [UserData.ID_USER]
    );

    if (userCheck.length === 0) {
      return {
        EM: "Không tìm thấy người dùng này",
        EC: 0,
        DT: [],
      };
    }

    // 2. Tạo mảng field update
    const updateFields = [];
    const updateValues = [];

    for (let key in UserData) {
      if (key !== "ID_USER" && UserData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(UserData[key]);
      }
    }

    if (updateFields.length === 0) {
      return {
        EM: "Không có trường nào để cập nhật",
        EC: 0,
        DT: [],
      };
    }

    // 3. Thêm ID_USER vào cuối mảng để WHERE
    updateValues.push(UserData.ID_USER);

    // 4. Thực hiện UPDATE
    const sqlUpdate = `UPDATE \`user\` SET ${updateFields.join(
      ", "
    )} WHERE ID_USER = ?`;
    await pool.execute(sqlUpdate, updateValues);

    // 5. Lấy lại thông tin user sau update
    const [results] = await pool.query(
      "SELECT * FROM `user` WHERE ID_USER = ?",
      [UserData.ID_USER]
    );

    if (results.length === 0) {
      return {
        EM: "Không tìm thấy thông tin người dùng sau khi cập nhật",
        EC: 0,
        DT: [],
      };
    }

    const user = results[0];

    // 6. Tạo JWT
    const token = jwt.sign(
      {
        ID_USER: user.ID_USER,
        ID_ROLE: user.ID_ROLE,
        EMAIL: user.EMAIL,
        FIRSTNAME: user.FIRSTNAME,
        LASTNAME: user.LASTNAME,
        PHONENUMBER: user.PHONENUMBER,
        ADDRESS: user.ADDRESS,
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
    console.error(error);
    return {
      EM: "Lỗi services Servces_Sua_ThongTin_User_ID_USER",
      EC: -1,
      DT: [],
    };
  }
};

module.exports = {
  Servces_xem_ThongTin_KhachHang_MA_KH,
  Servces_Sua_ThongTin_KhachHang_MA_KH,
};
