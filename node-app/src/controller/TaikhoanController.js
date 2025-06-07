const {
  Dangky_TaiKhoan,
  LoginTaikhoan,
  LoginTaikhoanwithGOOGLE,
  updateTaiKhoan_matkhau,
  updateTaiKhoan_thongtinkhachhang,
  updateTaiKhoan_avatar,
  verify_adminService,
} = require("../services/TaikhoanServices");
const JWT_SECRET = process.env.SECRETKEYADMIN;
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const dangky_new_taikhoan = async (req, res) => {
  try {
    const dataTaiKhoan = req.body;
    // console.log("body: ", dataTaiKhoan)
    let results = await Dangky_TaiKhoan(dataTaiKhoan);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const dangnhap_taikhoan = async (req, res) => {
  try {
    const EMAIL = req.body.email;
    const PASSWORD = req.body.password;

    console.log("req.body:", req.body)
    let results = await LoginTaikhoan(EMAIL, PASSWORD);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const dangnhap_taikhoanGOOGLE = async (req, res) => {
  try {
    const EMAIL = req.body.TEN_DANG_NHAP;
    const PASSWORD = req.body.TEN_KHACH_HANG;
    let results = await LoginTaikhoanwithGOOGLE(EMAIL, PASSWORD);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const suathongtin_matkhau_taikhoan = async (req, res) => {
  try {
    const TEN_DANG_NHAP = req.params.TEN_DANG_NHAP;
    const MAT_KHAU_CU = req.body.MAT_KHAU_CU;
    const MAT_KHAU_MOI = req.body.MAT_KHAU_MOI;

    let results = await updateTaiKhoan_matkhau(
      TEN_DANG_NHAP,
      MAT_KHAU_CU,
      MAT_KHAU_MOI
    );
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const suathongtin_taikhoan = async (req, res) => {
  try {
    const TEN_DANG_NHAP = req.params.TEN_DANG_NHAP;
    const datakhachhang = req.body;

    let results = await updateTaiKhoan_thongtinkhachhang(
      TEN_DANG_NHAP,
      datakhachhang
    );
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

//cập nhật avatar
const CapnhatAvatarUser = async (req, res) => {
  try {
    const TEN_DANG_NHAP = req.params.TEN_DANG_NHAP;
    const results = await updateTaiKhoan_avatar(
      TEN_DANG_NHAP,
      req.file.filename
    );
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
  }
};

//logout tài khoản
const logoutTaikhoan = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      EM: "Logout Thành Công !!!",
      EC: 0,
      DT: " ",
    });
  } catch {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: " ",
    });
  }
};

const loginUserGoogle = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(401).json({
      EM: "Email is missing",
      EC: 401,
      DT: [],
    });
  }

  try {
    // Kiểm tra nếu người dùng đã tồn tại trong cơ sở dữ liệu
    const [rows] = await pool.query(
      "SELECT * FROM khachhang WHERE TEN_DANG_NHAP = ?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      console.log("user", user);
      // Kiểm tra nếu tài khoản bị khóa
      if (
        user.GHI_CHU_KH === 0 ||
        user.GHI_CHU_KH === "" ||
        user.GHI_CHU_KH === null ||
        user.GHI_CHU_KH === "0"
      ) {
        return res.status(403).json({
          EM: "Tài khoản đã bị khóa, không thể đăng nhập",
          EC: 403,
          DT: "Account is disabled",
        });
      }
      const [phan_quyen] = await pool.query(
        "SELECT TEN_PHAN_QUYEN FROM phan_quyen WHERE MA_PHAN_QUYEN = ?",
        [user.MA_PHAN_QUYEN]
      );

      const token = jwt.sign(
        {
          MA_KH: user.MA_KH,
          TEN_DANG_NHAP: user.TEN_DANG_NHAP,
          phan_quyen: phan_quyen[0]?.TEN_PHAN_QUYEN || null,
          SDT_KH: user.SDT_KH,
        },
        JWT_SECRET,
        { expiresIn: "4h" }
      );

      return res.status(200).json({
        EM: "Login successful",
        EC: 200,
        DT: {
          accessToken: token,
          user: {
            id: user.MA_KH,
            email: user.TEN_DANG_NHAP,
            role: phan_quyen[0]?.TEN_PHAN_QUYEN || "User",
          },
        },
      });
    } else {
      // Nếu người dùng không tồn tại, thêm mới

      const MA_PHAN_QUYEN = 1; // Đặt quyền mặc định cho người dùng mới nếu cần
      const [insertResult] = await pool.query(
        "INSERT INTO khachhang (MA_PHAN_QUYEN, TEN_DANG_NHAP) VALUES (?, ?)",
        [MA_PHAN_QUYEN, email]
      );

      const newUserId = insertResult.insertId;

      const token = jwt.sign(
        {
          MA_KH: newUserId,
          TEN_DANG_NHAP: email,
          phan_quyen: "User", // Quyền mặc định cho người dùng mới
        },
        JWT_SECRET,
        { expiresIn: "4h" }
      );

      return res.status(200).json({
        EM: "New user created and logged in successfully",
        EC: 200,
        DT: {
          accessToken: token,
          user: {
            id: newUserId,
            email: email,
            role: "User",
          },
        },
      });
    }
  } catch (error) {
    console.error("Error in loginUserGoogle:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: 500,
      DT: [],
    });
  }
};

const verifyAdmin = async (req, res) => {
  try {
    const check = await verify_adminService(req.body);
    console.log("Check: ", check);
    return res.status(200).json({
      EM: "Kiểm tra thành công !!!",
      EC: 1,
      DT: check,
    });
  } catch {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getAll_taikhoanuser = async (req, res) => {
  try {
    let [results1, fields1] = await pool.execute(
      `
      SELECT user.*, role.*
      FROM user
      JOIN role ON role.ID_ROLE  = user.ID_ROLE 
      `
    );
    return res.status(200).json({
      EM: "Kiểm tra thành công !!!",
      EC: 1,
      DT: results1,
    });
  } catch {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const selectAll_PhanQuyen = async (req, res) => {
  try {
    const [results, fields] = await pool.execute("SELECT * FROM role");

    return res.status(200).json({
      EM: "Kiểm tra thành công !!!",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error in selectAll_PhanQuyen:", error);
    return {
      EM: "error from server",
      EC: -1,
      DT: null,
    };
  }
};

const update_PhanQuyen = async (req, res) => {
  try {
    // Lấy dữ liệu từ req.body
    const { MA_KH, MA_PHAN_QUYEN } = req.body;
    let GHI_CHU_KH = "";
    if ((MA_PHAN_QUYEN = 4)) {
      GHI_CHU_KH === "Tạm Khóa";
    }
    // Cập nhật thông tin phân quyền trong cơ sở dữ liệu
    const [results, fields] = await pool.execute(
      "UPDATE `khachhang` SET `MA_PHAN_QUYEN` = ?, `GHI_CHU_KH` = ? WHERE `MA_KH` = ?",
      [MA_PHAN_QUYEN, MA_KH] // Truyền các giá trị tham số vào câu lệnh SQL
    );

    // Trả về kết quả sau khi cập nhật
    return res.status(200).json({
      EM: "Cập nhật phân quyền thành công!",
      EC: 0,
      DT: results,
    });
  } catch (error) {
    console.error("Error in update_PhanQuyen:", error);
    return res.status(500).json({
      EM: "Lỗi từ phía server",
      EC: -1,
      DT: null,
    });
  }
};

module.exports = {
  dangky_new_taikhoan,
  dangnhap_taikhoan,
  logoutTaikhoan,
  suathongtin_matkhau_taikhoan,
  suathongtin_taikhoan,
  dangnhap_taikhoanGOOGLE,
  CapnhatAvatarUser,
  loginUserGoogle,

  verifyAdmin,

  getAll_taikhoanuser,
  selectAll_PhanQuyen,
  update_PhanQuyen,
};
