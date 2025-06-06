const pool = require("../../config/database");

// Tạo danh sách sản phẩm ưu tiên
const tao_danhsach_uu_tien = async (
  MASP,

  GHI_CHU_UT,
  HINH_ANH_BIA = null,
  HINH_ANH_LOGO = null,
  HINH_ANH_NAVBAR = null
) => {
  console.log(MASP, GHI_CHU_UT, HINH_ANH_BIA, HINH_ANH_LOGO, HINH_ANH_NAVBAR);
  try {
    // Kiểm tra nếu tất cả các tham số đầu vào hợp lệ
    if (!MASP || !GHI_CHU_UT) {
      return {
        EM: "Thiếu thông tin đầu vào",
        EC: 0,
        DT: [],
      };
    }

    // Kiểm tra nếu sản phẩm đã tồn tại trong bảng sanpham
    let [results1] = await pool.execute(
      "SELECT * FROM sanpham WHERE MASP = ?",
      [MASP]
    );
    if (results1.length === 0) {
      return {
        EM: "Sản phẩm không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    // Thêm sản phẩm vào bảng danhsachsanphamuutien
    let [results_tao] = await pool.execute(
      "INSERT INTO danhsachsanphamuutien (MASP, GHI_CHU_UT, THOI_GIAN_BAT_DAU_UT, THOI_GIAN_KET_THUC_UT, HINH_ANH_BIA, HINH_ANH_LOGO, HINH_ANH_NAVBAR) VALUES (?, ?, NOW(), NOW(), ?, ?, ?)",
      [MASP, GHI_CHU_UT, HINH_ANH_BIA, HINH_ANH_LOGO, HINH_ANH_NAVBAR]
    );

    return {
      EM: "Tạo danh sách ưu tiên thành công",
      EC: 1,
      DT: results_tao,
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi services tao_danhsach_uu_tien",
      EC: 0,
      DT: [],
    };
  }
};

// Xem tất cả sản phẩm trong danh sách ưu tiên
const xem_tatca_danhsach_uu_tien = async () => {
  try {
    let [results] = await pool.execute(`SELECT
        danhsachsanphamuutien.MASANPHAMUUTIEN,
        sanpham.TENSP,
        sanpham.DON_GIA,
        sanpham.NHA_SAN_XUAT,
        sanpham.ANH_SP,
    
        sanpham.MASP,
        danhsachsanphamuutien.GHI_CHU_UT,
        danhsachsanphamuutien.HINH_ANH_BIA,
        danhsachsanphamuutien.HINH_ANH_LOGO,
        danhsachsanphamuutien.HINH_ANH_NAVBAR,
        GROUP_CONCAT(DISTINCT theloai.TENTL) AS TENTL,
        danhsachsanphamuutien.THOI_GIAN_BAT_DAU_UT,
        danhsachsanphamuutien.THOI_GIAN_KET_THUC_UT
      FROM danhsachsanphamuutien
      JOIN sanpham ON danhsachsanphamuutien.MASP = sanpham.MASP
      LEFT JOIN thuoc_loai ON sanpham.MASP = thuoc_loai.MASP
      LEFT JOIN theloai ON thuoc_loai.MATL = theloai.MATL
      GROUP BY danhsachsanphamuutien.MASANPHAMUUTIEN;`);

    return {
      EM: "Xem tất cả danh sách ưu tiên thành công",
      EC: 1,
      DT: results,
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi services xem_tatca_danhsach_uu_tien",
      EC: 1,
      DT: [],
    };
  }
};

// Xem danh sách ưu tiên theo MASP
const xem_danhsach_uu_tien_theo_masp = async (MASANPHAMUUTIEN) => {
  try {
    let [results] = await pool.execute(
      "SELECT * FROM danhsachsanphamuutien WHERE MASANPHAMUUTIEN = ?",
      [MASANPHAMUUTIEN]
    );

    if (results.length === 0) {
      return {
        EM: "Không tồn tại danh sách ưu tiên cho sản phẩm này",
        EC: 0,
        DT: [],
      };
    }

    return {
      EM: "Xem danh sách ưu tiên thành công",
      EC: 1,
      DT: results,
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi services xem_danhsach_uu_tien_theo_masp",
      EC: 1,
      DT: [],
    };
  }
};

const sua_danhsach_uu_tien = async (MASANPHAMUUTIEN, MASP, GHI_CHU_UT) => {
  try {
    console.log(MASANPHAMUUTIEN, MASP, GHI_CHU_UT);
    // Kiểm tra xem danh sách ưu tiên có tồn tại không
    let [results] = await pool.execute(
      "SELECT * FROM danhsachsanphamuutien WHERE MASANPHAMUUTIEN = ?",
      [MASANPHAMUUTIEN]
    );

    if (results.length === 0) {
      return {
        EM: "Không tồn tại danh sách ưu tiên cho sản phẩm này",
        EC: 0,
        DT: [],
      };
    }

    // Tạo câu truy vấn update động
    let updateQuery = "UPDATE danhsachsanphamuutien SET ";
    let params = [];

    // Kiểm tra và thêm tham số cần cập nhật vào câu truy vấn
    if (GHI_CHU_UT) {
      updateQuery += "GHI_CHU_UT = ?, ";
      params.push(GHI_CHU_UT);
    }

    if (MASP) {
      updateQuery += "MASP = ?, ";
      params.push(MASP);
    }

    // Cập nhật thời gian bắt đầu và kết thúc (luôn được cập nhật)
    updateQuery +=
      "THOI_GIAN_BAT_DAU_UT = NOW(), THOI_GIAN_KET_THUC_UT = NOW() ";

    // Thêm điều kiện WHERE
    updateQuery += "WHERE MASANPHAMUUTIEN = ?";
    params.push(MASANPHAMUUTIEN);

    // Xóa dấu phẩy dư thừa ở cuối câu truy vấn nếu có
    updateQuery = updateQuery.replace(/, (\s)?$/, "");

    // Thực thi truy vấn update
    let [updateResult] = await pool.execute(updateQuery, params);

    return {
      EM: "Sửa danh sách ưu tiên thành công",
      EC: 1,
      DT: updateResult,
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi services sua_danhsach_uu_tien",
      EC: -1,
      DT: [],
    };
  }
};

// Xóa danh sách ưu tiên theo MASP
const xoa_danhsach_uu_tien = async (MASANPHAMUUTIEN) => {
  try {
    let [results] = await pool.execute(
      "SELECT * FROM danhsachsanphamuutien WHERE MASANPHAMUUTIEN = ?",
      [MASANPHAMUUTIEN]
    );

    if (results.length === 0) {
      return {
        EM: "Không tồn tại danh sách ưu tiên cho sản phẩm này",
        EC: 0,
        DT: [],
      };
    }

    // Xóa danh sách ưu tiên của sản phẩm
    await pool.execute(
      "DELETE FROM danhsachsanphamuutien WHERE MASANPHAMUUTIEN = ?",
      [MASANPHAMUUTIEN]
    );

    return {
      EM: "Xóa danh sách ưu tiên thành công",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi services xoa_danhsach_uu_tien",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = {
  tao_danhsach_uu_tien,
  xem_tatca_danhsach_uu_tien,
  xem_danhsach_uu_tien_theo_masp,
  sua_danhsach_uu_tien,
  xoa_danhsach_uu_tien,
};
