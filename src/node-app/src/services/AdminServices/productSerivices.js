const pool = require("../../config/database");

const tao_sanpham = async (datasanpham, anhsp) => {
  try {
    console.log("Dữ liệu sản phẩm:", datasanpham);
    console.log("anhsp:", anhsp);
    // 1. Tạo sản phẩm (bảng `product`)
    const [productResult] = await pool.execute(
      `INSERT INTO product (
        ID_PROMOTION, ID_CATEGORY, ID_BRAND,
        NAMEPRODUCT, SLUG, STATUS, UNIT,
        METATITLE, SHORTDESCRIPTION, DESCRIPTION, METADESCRIPTION,
        ISDELETE, CREATEAT, UPDATEAT, GALLERYPRODUCT
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
      [
        datasanpham.selectedPromotion,
        datasanpham.selectedCategories,
        datasanpham.selectedBrand,
        datasanpham.NAME_PRODUCTDETAILS,
        datasanpham.NAME_PRODUCTDETAILS.toLowerCase().replace(/\s+/g, "-"),
        1, // STATUS mặc định là 1 (đang bán)
        datasanpham.UNIT,
        datasanpham.METATITLE,
        datasanpham.SHORTDESCRIPTION,
        datasanpham.DESCRIPTION,
        datasanpham.METADESCRIPTION,
        datasanpham.ISDELETE,
        anhsp || null,
      ]
    );

    // 2. Lấy ID_PRODUCT vừa insert
    const ID_PRODUCT = productResult.insertId;

    // 3. Tạo chi tiết sản phẩm (bảng `product_details`)
    await pool.execute(
      `INSERT INTO product_details (
        ID_PRODUCT, NAME_PRODUCTDETAILS,
        PRICE_PRODUCTDETAILS, SALE_PRODUCTDETAILS, RATING_PRODUCTDETAILS,
        ISSHOW_PRODUCTDETAILS, AMOUNT_AVAILABLE, SPECIFICATION,
        Import_Price, GALLERYPRODUCT_DETAILS, USERUPDATE,
        CREATEAT, UPDATEAT, ISDELETE
      ) VALUES (?, ?, ?, 0, 0, 1, ?, ?, ?, ?, 'admin', NOW(), NOW(), ?)`,
      [
        ID_PRODUCT,
        datasanpham.NAME_PRODUCTDETAILS,
        datasanpham.PRICE_PRODUCTDETAILS,
        datasanpham.AMOUNT_AVAILABLE,
        datasanpham.SPECIFICATION,
        datasanpham.Import_Price,
        anhsp || null,
        datasanpham.ISDELETE,
      ]
    );

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
      SELECT 
        product_details.*,
        product.*,
        brand.*, 
        category.*
      FROM product_details
      JOIN product ON product_details.ID_PRODUCT = product.ID_PRODUCT
      JOIN brand ON product.ID_BRAND = brand.ID_BRAND
      JOIN category ON product.ID_CATEGORY = category.ID_CATEGORY
      WHERE product.ISDELETE != 1
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

const xem_sanpham_id = async (ID_PRODUCTDETAILS, ID_USER) => {
  try {
    // Truy vấn thông tin sản phẩm và thể loại
    let [results, fields] = await pool.execute(
      `
      SELECT 
        product_details.*,
        product.*,
        brand.*, 
        category.*
      FROM product_details
      JOIN product ON product_details.ID_PRODUCT = product.ID_PRODUCT
      JOIN brand ON product.ID_BRAND = brand.ID_BRAND
      JOIN category ON product.ID_CATEGORY = category.ID_CATEGORY
      WHERE product_details.ID_PRODUCTDETAILS = ?;
      `,
      [ID_PRODUCTDETAILS]
    );

    if (results.length === 0) {
      return {
        EM: "Sản phẩm không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    return {
      EM: "Xem sản phẩm thành công 1",
      EC: 1,
      DT: results,
    };
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

const xoa_sanpham_id = async (ID_PRODUCT) => {
  try {
    // Cập nhật ISDELETE của bảng product
    await pool.execute(
      `UPDATE product 
       SET ISDELETE = 1, UPDATEAT = NOW() 
       WHERE ID_PRODUCT = ?`,
      [ID_PRODUCT]
    );

    // Cập nhật ISDELETE của bảng product_details
    await pool.execute(
      `UPDATE product_details 
       SET ISDELETE = 1, UPDATEAT = NOW() 
       WHERE ID_PRODUCT = ?`,
      [ID_PRODUCT]
    );

    return {
      EM: "Xóa sản phẩm thành công",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi services xoa_sanpham_id",
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
