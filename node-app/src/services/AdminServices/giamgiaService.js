const pool = require("../../config/database");
const tao_giamgia = async (datasanpham) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from giam_gia where TEN_CHUONG_TRINH_GIAM_GIA = ?",
      [datasanpham.TEN_CHUONG_TRINH_GIAM_GIA]
    );
    if (results1.length > 0) {
      return {
        EM: "giảm giá đã tồn tại",
        EC: 0,
        DT: [],
      };
    }

    let [results_tao, fields_tao] = await pool.execute(
      `insert into giam_gia 
      (TEN_CHUONG_TRINH_GIAM_GIA,LOAI_GIAM_GIA,GIA_TRI_GIAM_GIA,MO_TA_CHUONG_TRINH_GIAM_GIA,TRANG_THAI_GIAM_GIA,GHI_CHU_GIAM_GIA) 
      values (?,?,?,?,?,?)`,
      [
        datasanpham.TEN_CHUONG_TRINH_GIAM_GIA,
        datasanpham.LOAI_GIAM_GIA,
        datasanpham.GIA_TRI_GIAM_GIA,
        datasanpham.MO_TA_CHUONG_TRINH_GIAM_GIA,
        datasanpham.TRANG_THAI_GIAM_GIA,
        datasanpham.GHI_CHU_GIAM_GIA,
      ]
    );

    return {
      EM: "tạo giảm giá thành công",
      EC: 1,
      DT: results_tao,
    };
  } catch (error) {
    return {
      EM: "lỗi services tao_giamgia",
      EC: -1,
      DT: [],
    };
  }
};

const xem_tatca_giamgia = async () => {
  try {
    let [results1, fields1] = await pool.execute("select * from giam_gia");
    console.log(results1);
    return {
      EM: "xem tất cả giảm giá thành công111",
      EC: 1,
      DT: results1,
    };
  } catch (error) {
    return {
      EM: "lỗi services xem_tatca_giamgia",
      EC: -1,
      DT: [],
    };
  }
};

const xem_giamgia_id = async (MA_GIAM_GIA) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from giam_gia where MA_GIAM_GIA = ?",
      [MA_GIAM_GIA]
    );

    if (results1.length < 0) {
      return {
        EM: "không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    return {
      EM: "xem giảm giá thành công",
      EC: 1,
      DT: results1,
    };
  } catch (error) {
    return {
      EM: "lỗi services xem_giamgia_id",
      EC: -1,
      DT: [],
    };
  }
};

const sua_giamgia_id = async (MA_GIAM_GIA, datasanpham) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from giam_gia where MA_GIAM_GIA = ?",
      [MA_GIAM_GIA]
    );

    if (results1.length > 0) {
      let [results, fields] = await pool.execute(
        `UPDATE giam_gia SET TEN_CHUONG_TRINH_GIAM_GIA = ?, LOAI_GIAM_GIA = ?,  GIA_TRI_GIAM_GIA = ?, MO_TA_CHUONG_TRINH_GIAM_GIA = ?, TRANG_THAI_GIAM_GIA = ?, GHI_CHU_GIAM_GIA = ?  WHERE MA_GIAM_GIA = ?`,
        [
          datasanpham.TEN_CHUONG_TRINH_GIAM_GIA,
          datasanpham.LOAI_GIAM_GIA,
          datasanpham.GIA_TRI_GIAM_GIA,
          datasanpham.MO_TA_CHUONG_TRINH_GIAM_GIA,
          datasanpham.TRANG_THAI_GIAM_GIA,
          datasanpham.GHI_CHU_GIAM_GIA,
          MA_GIAM_GIA,
        ]
      );
      return {
        EM: "sửa giảm giá thành công",
        EC: 1,
        DT: results,
      };
    } else {
      await pool.execute(
        `insert into giam_gia 
            (TEN_CHUONG_TRINH_GIAM_GIA,LOAI_GIAM_GIA,GIA_TRI_GIAM_GIA,MO_TA_CHUONG_TRINH_GIAM_GIA,TRANG_THAI_GIAM_GIA,GHI_CHU_GIAM_GIA) 
            values (?,?,?,?,?,?)`,
        [
          datasanpham.TEN_CHUONG_TRINH_GIAM_GIA,
          datasanpham.LOAI_GIAM_GIA,
          datasanpham.GIA_TRI_GIAM_GIA,
          datasanpham.MO_TA_CHUONG_TRINH_GIAM_GIA,
          datasanpham.TRANG_THAI_GIAM_GIA,
          datasanpham.GHI_CHU_GIAM_GIA,
        ]
      );
      return {
        EM: "thêm giảm giá thành công",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    return {
      EM: "lỗi services sua_giamgia_id",
      EC: -1,
      DT: [],
    };
  }
};

const xoa_giamgia_id = async (MA_GIAM_GIA) => {
  try {
    let [results_kiemtra, fields_kiemtra] = await pool.execute(
      "select * from co_giam_gia where MA_GIAM_GIA = ?;",
      [MA_GIAM_GIA]
    );

    if (results_kiemtra.length > 0) {
      await pool.execute("DELETE FROM co_giam_gia  WHERE MA_GIAM_GIA=?;", [
        MA_GIAM_GIA,
      ]);
    }

    await pool.execute("DELETE FROM giam_gia WHERE MA_GIAM_GIA=?;", [
      MA_GIAM_GIA,
    ]);
    return {
      EM: "xóa giảm giá thành công",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    return {
      EM: "lỗi services xoa_sanpham_id",
      EC: -1,
      DT: [],
    };
  }
};

module.exports = {
  tao_giamgia,
  xem_tatca_giamgia,
  xem_giamgia_id,
  sua_giamgia_id,
  xoa_giamgia_id,
};
