const pool = require("../../config/database");
const tao_theloai = async (NAME_CATEGORY, PARENTID, DESCRIPTION, ISDELETE) => {
  try {
    // 1. Kiểm tra trùng tên
    const [checkExist] = await pool.execute(
      "SELECT * FROM category WHERE NAME_CATEGORY = ?",
      [NAME_CATEGORY]
    );

    if (checkExist.length > 0) {
      return {
        EM: "Thể loại đã tồn tại",
        EC: 0,
        DT: [],
      };
    }

    // 2. Tạo SLUG (chuyển tên thành định dạng đường dẫn)
    const SLUG = NAME_CATEGORY.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
      .replace(/\s+/g, "-")           // khoảng trắng thành gạch ngang
      .replace(/[^a-z0-9-]/g, "")     // bỏ ký tự đặc biệt

    // 3. Thêm mới
    const [results_tao] = await pool.execute(
      `INSERT INTO category 
        (NAME_CATEGORY, SLUG, PARENTID, DESCRIPTION, ISDELETE, CREATEAT, UPDATEAT)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [NAME_CATEGORY, SLUG, PARENTID || null, DESCRIPTION, ISDELETE]
    );

    return {
      EM: "Tạo thể loại thành công",
      EC: 1,
      DT: results_tao,
    };
  } catch (error) {
    console.error("Lỗi services tao_theloai:", error);
    return {
      EM: "Lỗi services tạo thể loại",
      EC: 1,
      DT: [],
    };
  }
};

const xem_tatca_theloai = async () => {
  try {
    let [results1, fields1] = await pool.execute("select * from category");

    return {
      EM: "Xem thể loại thành công",
      EC: 1,
      DT: results1,
    };
  } catch (error) {
    return {
      EM: "lỗi services xem_tatca_theloai",
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

const sua_theloai_id = async (ID_CATEGORY, NAME_CATEGORY, PARENTID, DESCRIPTION, ISDELETE) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM category WHERE ID_CATEGORY = ?",
      [ID_CATEGORY]
    );

    if (rows.length === 0) {
      return {
        EM: "Danh mục không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    await pool.execute(
      `UPDATE category 
       SET NAME_CATEGORY = ?, DESCRIPTION = ?, ISDELETE = ?, PARENTID = ?, UPDATEAT = NOW() 
       WHERE ID_CATEGORY = ?`,
      [NAME_CATEGORY, DESCRIPTION, ISDELETE, PARENTID || null, ID_CATEGORY]
    );

    return {
      EM: "Cập nhật danh mục thành công",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật category:", error);
    return {
      EM: "Lỗi service sửa danh mục",
      EC: 1,
      DT: [],
    };
  }
};

const xoa_theloai_id = async (ID_CATEGORY) => {
  try {
    // 1. Kiểm tra category có tồn tại không
    const [checkExist] = await pool.execute(
      "SELECT * FROM category WHERE ID_CATEGORY = ?",
      [ID_CATEGORY]
    );

    if (checkExist.length === 0) {
      return {
        EM: "Danh mục không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    // 2. Kiểm tra sản phẩm đang dùng category này
    const [productCount] = await pool.execute(
      "SELECT COUNT(*) AS total FROM product WHERE ID_CATEGORY = ?",
      [ID_CATEGORY]
    );

    if (productCount[0].total > 0) {
      return {
        EM: "Không thể xoá vì vẫn còn sản phẩm thuộc danh mục này",
        EC: 0,
        DT: [],
      };
    }

    // 3. Kiểm tra xem có category nào khác đang dùng ID_CATEGORY này làm PARENTID không
    const [childCategories] = await pool.execute(
      "SELECT COUNT(*) AS total FROM category WHERE PARENTID = ?",
      [ID_CATEGORY]
    );

    if (childCategories[0].total > 0) {
      return {
        EM: "Không thể xoá vì danh mục này đang là danh mục cha của danh mục khác",
        EC: 0,
        DT: [],
      };
    }

    // 4. Nếu không bị ràng buộc, xóa cứng
    await pool.execute(
      "DELETE FROM category WHERE ID_CATEGORY = ?",
      [ID_CATEGORY]
    );

    return {
      EM: "Xoá thể loại thành công (cứng)",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.error("Lỗi khi xoá thể loại:", error);
    return {
      EM: "Lỗi hệ thống khi xoá thể loại",
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
