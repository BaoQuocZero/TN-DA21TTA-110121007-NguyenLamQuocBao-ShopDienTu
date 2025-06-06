const pool = require("../../config/database");
const tao_theloai = async (TENTL, MO_TA_TL) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from theloai where TENTL = ?",
      [TENTL]
    );
    if (results1.length > 0) {
      return {
        EM: "thể loại đã tồn tại",
        EC: 0,
        DT: [],
      };
    }

    let [results_tao, fields_tao] = await pool.execute(
      "insert into theloai (TENTL,MO_TA_TL) values (?,?)",
      [TENTL, MO_TA_TL]
    );

    return {
      EM: "tạo thể loại thành công",
      EC: 1,
      DT: results_tao,
    };
  } catch (error) {
    return {
      EM: "lỗi services createTaiKhoan",
      EC: 1,
      DT: [],
    };
  }
};

const xem_tatca_theloai = async () => {
  try {
    let [results1, fields1] = await pool.execute("select * from theloai");

    return {
      EM: "tạo thể loại thành công",
      EC: 1,
      DT: results1,
    };
  } catch (error) {
    return {
      EM: "lỗi services createTaiKhoan",
      EC: 1,
      DT: [],
    };
  }
};

const xem_theloai_id = async (MATL) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from theloai where MATL = ?",
      [MATL]
    );

    if (results1.length < 0) {
      return {
        EM: "không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    return {
      EM: "xem thể loại thành công",
      EC: 1,
      DT: results1,
    };
  } catch (error) {
    return {
      EM: "lỗi services createTaiKhoan",
      EC: 1,
      DT: [],
    };
  }
};

const sua_theloai_id = async (MATL, TENTL, MO_TA_TL) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from theloai where MATL = ?",
      [MATL]
    );

    if (results1.length > 0) {
      let [results, fields] = await pool.execute(
        `UPDATE theloai SET TENTL = ?, MO_TA_TL = ? WHERE MATL = ?`,
        [TENTL, MO_TA_TL, MATL]
      );
      return {
        EM: "sửa thể loại thành công",
        EC: 0,
        DT: [],
      };
    }

    return {
      EM: "không tồn tại",
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

const xoa_theloai_id = async (MATL) => {
  try {
    await pool.execute("DELETE FROM thuoc_loai WHERE MATL=?;", [MATL]);

    await pool.execute("DELETE FROM theloai WHERE MATL=?;", [MATL]);

    return {
      EM: "xóa thể loại thành công",
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

module.exports = {
  tao_theloai,
  xem_tatca_theloai,
  xem_theloai_id,
  sua_theloai_id,
  xoa_theloai_id,
};
