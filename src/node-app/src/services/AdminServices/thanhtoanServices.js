const pool = require("../../config/database");

const tao_thanh_toan = async (CACH_THANH_TOAN, GHI_CHU_THANH_TOAN) => {
  try {
    // Kiểm tra xem cách thanh toán đã tồn tại chưa (nếu cần thiết)
    let [results1, fields1] = await pool.execute(
      "select * from thanh_toan where CACH_THANH_TOAN = ?",
      [CACH_THANH_TOAN]
    );
    if (results1.length > 0) {
      return {
        EM: "Cách thanh toán đã tồn tại",
        EC: 0,
        DT: [],
      };
    }
    const TRANG_THAI_THANH_TOAN = 1;
    // Thêm bản ghi thanh toán mới
    let [results_tao, fields_tao] = await pool.execute(
      "insert into thanh_toan (CACH_THANH_TOAN, GHI_CHU_THANH_TOAN,TRANG_THAI_THANH_TOAN) values (?, ?,?)",
      [CACH_THANH_TOAN, GHI_CHU_THANH_TOAN, TRANG_THAI_THANH_TOAN]
    );

    return {
      EM: "Tạo thanh toán thành công",
      EC: 1,
      DT: results_tao,
    };
  } catch (error) {
    return {
      EM: "Lỗi khi tạo thanh toán",
      EC: 0,
      DT: [],
    };
  }
};

const xem_tatca_thanh_toan = async () => {
  try {
    let [results1, fields1] = await pool.execute("select * from thanh_toan");

    return {
      EM: "Lấy tất cả thanh toán thành công",
      EC: 1,
      DT: results1,
    };
  } catch (error) {
    return {
      EM: "Lỗi khi lấy tất cả thanh toán",
      EC: 0,
      DT: [],
    };
  }
};

const xem_thanh_toan_id = async (MA_THANH_TOAN) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from thanh_toan where MA_THANH_TOAN = ?",
      [MA_THANH_TOAN]
    );

    if (results1.length === 0) {
      return {
        EM: "Thanh toán không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    return {
      EM: "Lấy thanh toán thành công",
      EC: 1,
      DT: results1,
    };
  } catch (error) {
    return {
      EM: "Lỗi khi lấy thanh toán",
      EC: 0,
      DT: [],
    };
  }
};

const sua_thanh_toan_id = async (
  MA_THANH_TOAN,
  CACH_THANH_TOAN,
  GHI_CHU_THANH_TOAN
) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from thanh_toan where MA_THANH_TOAN = ?",
      [MA_THANH_TOAN]
    );

    if (results1.length > 0) {
      let [results, fields] = await pool.execute(
        "UPDATE thanh_toan SET CACH_THANH_TOAN = ?, GHI_CHU_THANH_TOAN = ? WHERE MA_THANH_TOAN = ?",
        [CACH_THANH_TOAN, GHI_CHU_THANH_TOAN, MA_THANH_TOAN]
      );
      return {
        EM: "Sửa thanh toán thành công",
        EC: 1,
        DT: [],
      };
    }

    return {
      EM: "Thanh toán không tồn tại",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    return {
      EM: "Lỗi khi sửa thanh toán",
      EC: 0,
      DT: [],
    };
  }
};

const xoa_thanh_toan_id = async (MA_THANH_TOAN) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from thanh_toan where MA_THANH_TOAN = ?",
      [MA_THANH_TOAN]
    );

    if (results1.length > 0) {
      await pool.execute("DELETE FROM thanh_toan WHERE MA_THANH_TOAN = ?", [
        MA_THANH_TOAN,
      ]);
      return {
        EM: "Xóa thanh toán thành công",
        EC: 1,
        DT: [],
      };
    }

    return {
      EM: "Thanh toán không tồn tại",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    return {
      EM: "Lỗi khi xóa thanh toán",
      EC: 0,
      DT: [],
    };
  }
};

module.exports = {
  tao_thanh_toan,
  xem_tatca_thanh_toan,
  xem_thanh_toan_id,
  sua_thanh_toan_id,
  xoa_thanh_toan_id,
};
