const pool = require("../../config/database");
const tao_sanpham = async (datasanpham, anhsp) => {
  let categories;

  try {
    categories = datasanpham.selectedCategories
      ? JSON.parse(datasanpham.selectedCategories)
      : [];
  } catch (error) {
    console.error("Error parsing selectedCategories:", error);
    return {
      EM: "Dữ liệu selectedCategories không hợp lệ",
      EC: 0,
      DT: [],
    };
  }

  try {
    console.log("Dữ liệu sản phẩm:", datasanpham);
    console.log("Danh sách thể loại:", categories);

    // Kiểm tra sản phẩm đã tồn tại
    let [results1] = await pool.execute(
      "SELECT * FROM sanpham WHERE TENSP = ?",
      [datasanpham.TENSP]
    );
    if (results1.length > 0) {
      return {
        EM: "Sản phẩm đã tồn tại",
        EC: 0,
        DT: [],
      };
    }

    // Tạo sản phẩm mới
    let [results_tao] = await pool.execute(
      "INSERT INTO sanpham (TENSP, DON_GIA, NHA_SAN_XUAT, ANH_SP, GHI_CHU_SP, TRANG_THAI_SAN_PHAM, NGAY_CAP_NHAT, NGAY_RA_MAT) VALUES (?,?,?,?,?,?,NOW(),NOW())",
      [
        datasanpham.TENSP,
        datasanpham.DON_GIA,
        datasanpham.NHA_SAN_XUAT,
        anhsp,
        datasanpham.GHI_CHU_SP,
        datasanpham.TRANG_THAI_SAN_PHAM,
      ]
    );

    console.log("Kết quả tạo sản phẩm:", results_tao);

    // Lấy lại sản phẩm vừa tạo
    let [results_timkiem] = await pool.execute(
      "SELECT * FROM sanpham WHERE TENSP = ?",
      [datasanpham.TENSP]
    );

    console.log("Sản phẩm vừa tạo:", results_timkiem);

    // Thêm thể loại vào bảng `thuoc_loai`
    if (Array.isArray(categories) && categories.length > 0) {
      for (const matl of categories) {
        try {
          let [result_insert] = await pool.execute(
            "INSERT INTO thuoc_loai (MASP, MATL) VALUES (?, ?)",
            [results_timkiem[0].MASP, matl]
          );
          console.log("Kết quả thêm thể loại:", result_insert);
        } catch (error) {
          console.error(`Lỗi khi thêm thể loại ${matl}:`, error);
        }
      }
    }

    return {
      EM: "Tạo sản phẩm thành công",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.error("Lỗi trong quá trình tạo sản phẩm:", error);
    return {
      EM: "Lỗi khi tạo sản phẩm",
      EC: 0,
      DT: [],
    };
  }
};

const xem_tatca_sanpham = async () => {
  try {
    let [results1, fields1] = await pool.execute(
      `
      SELECT * FROM product_details
      `
    );

    return {
      EM: "xem tất cả sản phẩm thành công",
      EC: 1,
      DT: results1,
    };
  } catch (error) {
    console.error(error); // Ghi log lỗi chi tiết để dễ dàng kiểm tra
    return {
      EM: "lỗi services xem_tatca_sanpham",
      EC: 0,
      DT: [],
    };
  }
};

const xem_sanpham_id = async (MASP, MA_KHH) => {
  try {
    console.log("select game  MA_KHH", MA_KHH);
    // Truy vấn thông tin sản phẩm và thể loại
    let [results, fields] = await pool.execute(
      `
      SELECT 
        sp.MASP,
        sp.TENSP,
        sp.DON_GIA,
        sp.NHA_SAN_XUAT,
        sp.ANH_SP,
        sp.GHI_CHU_SP,
        sp.TRANG_THAI_SAN_PHAM,
        tl.MATL,
        tl.TENTL,
        tl.MO_TA_TL,
        tl.GHI_CHU_TL
      FROM 
        sanpham sp
      LEFT JOIN 
        thuoc_loai tlk ON sp.MASP = tlk.MASP
      LEFT JOIN 
        theloai tl ON tlk.MATL = tl.MATL
      WHERE 
        sp.MASP = ?
      `,
      [MASP]
    );

    if (results.length === 0) {
      return {
        EM: "Sản phẩm không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    // Gộp các thể loại
    const product = {
      MASP: results[0].MASP,
      TENSP: results[0].TENSP,
      DON_GIA: results[0].DON_GIA,
      NHA_SAN_XUAT: results[0].NHA_SAN_XUAT,
      ANH_SP: results[0].ANH_SP,
      GHI_CHU_SP: results[0].GHI_CHU_SP,
      TRANG_THAI_SAN_PHAM: results[0].TRANG_THAI_SAN_PHAM,
      categories: results.map((row) => ({
        MATL: row.MATL,
        TENTL: row.TENTL,
        MO_TA_TL: row.MO_TA_TL,
        GHI_CHU_TL: row.GHI_CHU_TL,
      })),
    };
    if (!MA_KHH) {
      return {
        EM: "Xem sản phẩm thành công",
        EC: 1,
        DT: product,
      };
    } else {
      // Kiểm tra nếu khách hàng đã mua sản phẩm
      let [orderResults, orderFields] = await pool.execute(
        `
          SELECT  DISTINCT 
            cthd.MASP
          FROM 
            chi_tiet_hoa_don cthd
          JOIN 
            hoadon hd ON cthd.MAHD = hd.MAHD
          WHERE 
            hd.MA_KH = ? AND cthd.MASP = ? AND hd.GHI_CHU_HOA_DON = "Giao dịch thành công"
          `,
        [MA_KHH, MASP]
      );
      console.log("orderResults", orderResults);
      const isPurchased = orderResults.length > 0;
      console.log("isPurchased", isPurchased);
      const DaMua = isPurchased ? "Đã Mua" : "Chưa Mua";

      return {
        EM: "Xem sản phẩm thành công 1",
        EC: 1,
        DT: { ...product, DaMua },
      };
    }
  } catch (error) {
    console.error("Error in xem_sanpham_id:", error);
    return {
      EM: "Lỗi dịch vụ khi xem sản phẩm",
      EC: -1,
      DT: [],
    };
  }
};

const sua_sanpham_id = async (MASP, datasanpham, anhsp) => {
  try {
    let categories = JSON.parse(datasanpham.selectedCategories);
    console.log("check datasp:", datasanpham);

    let [results1] = await pool.execute(
      "SELECT * FROM sanpham WHERE MASP = ?",
      [MASP]
    );

    if (results1.length > 0) {
      if (anhsp === null) {
        let [results] = await pool.execute(
          `UPDATE sanpham 
           SET TENSP = ?, DON_GIA = ?, NHA_SAN_XUAT = ?, GHI_CHU_SP = ?, TRANG_THAI_SAN_PHAM = ?, NGAY_CAP_NHAT = NOW() 
           WHERE MASP = ?`,
          [
            datasanpham.TENSP,
            datasanpham.DON_GIA,
            datasanpham.NHA_SAN_XUAT,
            datasanpham.GHI_CHU_SP,
            datasanpham.TRANG_THAI_SAN_PHAM,
            MASP,
          ]
        );

        if (Array.isArray(categories) && categories.length > 0) {
          await pool.execute("DELETE FROM thuoc_loai WHERE MASP = ?", [MASP]);

          for (const matl of categories) {
            await pool.execute(
              "INSERT INTO thuoc_loai (MASP, MATL) VALUES (?, ?)",
              [MASP, matl]
            );
          }
        }

        return {
          EM: "Sửa sản phẩm thành công",
          EC: 1,
          DT: results,
        };
      }

      let [results] = await pool.execute(
        `UPDATE sanpham 
         SET TENSP = ?, DON_GIA = ?, NHA_SAN_XUAT = ?, GHI_CHU_SP = ?, ANH_SP = ?, TRANG_THAI_SAN_PHAM = ?, NGAY_CAP_NHAT = NOW() 
         WHERE MASP = ?`,
        [
          datasanpham.TENSP,
          datasanpham.DON_GIA,
          datasanpham.NHA_SAN_XUAT,
          datasanpham.GHI_CHU_SP,
          anhsp,
          datasanpham.TRANG_THAI_SAN_PHAM,
          MASP,
        ]
      );

      if (Array.isArray(categories) && categories.length > 0) {
        await pool.execute("DELETE FROM thuoc_loai WHERE MASP = ?", [MASP]);
        for (const matl of categories) {
          await pool.execute(
            "INSERT INTO thuoc_loai (MASP, MATL) VALUES (?, ?)",
            [MASP, matl]
          );
        }
      }

      return {
        EM: "Sửa sản phẩm thành công",
        EC: 1,
        DT: results,
      };
    }

    return {
      EM: "Sản phẩm không tồn tại",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.error("Lỗi:", error);
    return {
      EM: "Lỗi trong services sua_sanpham_id",
      EC: 0,
      DT: [],
    };
  }
};

const xoa_sanpham_id = async (MASP) => {
  try {
    let [results_kiemtra, fields_kiemtra] = await pool.execute(
      "select * from chi_tiet_hoa_don where MASP = ?;",
      [MASP]
    );

    let [results_kiemtra2, fields_kiemtra2] = await pool.execute(
      "select * from thuoc_loai where MASP = ?;",
      [MASP]
    );

    if (results_kiemtra2.length > 0) {
      await pool.execute("DELETE FROM thuoc_loai WHERE MASP=?;", [MASP]);
    }

    if (results_kiemtra.length > 0) {
      let [results1, fields1] = await pool.execute(
        "DELETE FROM chi_tiet_hoa_don WHERE MASP=?;",
        [MASP]
      );
    }

    let [results2, fields2] = await pool.execute(
      "DELETE FROM sanpham WHERE MASP=?;",
      [MASP]
    );
    return {
      EM: "xóa sản phẩm thành công",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "lỗi services xoa_sanpham_id",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = {
  tao_sanpham,
  xem_tatca_sanpham,
  xoa_sanpham_id,
  sua_sanpham_id,
  xem_sanpham_id,
};
