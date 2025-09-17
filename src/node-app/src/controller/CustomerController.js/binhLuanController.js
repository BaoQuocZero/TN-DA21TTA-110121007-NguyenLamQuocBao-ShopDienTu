const pool = require("../../config/database"); // Đảm bảo `connection` được import từ tệp kết nối cơ sở dữ liệu của bạn

const onAddComment = async (req, res) => {
  // console.log("req.body", req.body);

  try {
    const {
      ID_USER,
      ID_PRODUCTDETAILS,
      CONTENT_COMMENT,
      RATING,
    } = req.body;

    const now = new Date();

    console.log("asdsadasdasd:  ", req.body)
    // Insert vào bảng comment
    const [results] = await pool.execute(
      `
      INSERT INTO comment(
        ID_PRODUCTDETAILS, 
        ID_USER, 
        CONTENT_COMMENT, 
        STATUS, 
        RATING, 
        ISSHOW, 
        CREATEAT, 
        UPDATEAT, 
        ISDELETE
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        ID_PRODUCTDETAILS,
        ID_USER,
        CONTENT_COMMENT,
        "Đã duyệt",   // hoặc "Chờ duyệt" tùy yêu cầu
        RATING,
        1,            // hiển thị
        now,
        now,
        0             // chưa xóa
      ]
    );

    return res.status(200).json({
      EM: "Thêm đánh giá và bình luận thành công",
      EC: 1,
      DT: {
        insertedId: results.insertId,
      },
    });
  } catch (error) {
    console.error("Error when adding review/comment:", error);
    return res.status(500).json({
      EM: "Lỗi hệ thống khi Thêm đánh giá và bình luận",
      EC: -1,
    });
  }
};

// 1. Lấy danh sách bình luận
const getProductReviews = async (req, res) => {
  const { id } = req.params; // Lấy ID_PRODUCT từ URL
  console.log("bình luận của sản phẩm", id);

  try {
    const [results] = await pool.execute(
      `
      SELECT 
          c.*, 
          u.FIRSTNAME, 
          u.LASTNAME,
          (
            SELECT AVG(c2.RATING) 
            FROM comment c2 
            JOIN product_details pd2 
              ON pd2.ID_PRODUCTDETAILS = c2.ID_PRODUCTDETAILS 
            WHERE pd2.ID_PRODUCT = ?
          ) AS AVG_RATING
      FROM comment c
      JOIN user u ON u.ID_USER = c.ID_USER
      JOIN product_details pd ON pd.ID_PRODUCTDETAILS = c.ID_PRODUCTDETAILS
      WHERE pd.ID_PRODUCT = ?;
      `,
      [id, id] // truyền 2 lần vì query có 2 dấu ?
    );

    if (results.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đánh giá hoặc bình luận cho sản phẩm này",
        EC: 1,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Lấy đánh giá và bình luận thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error fetching reviews and comments:", error);
    return res.status(500).json({
      EM: "Lỗi hệ thống khi lấy đánh giá và bình luận",
      EC: -1,
    });
  }
};

// 2. Cập nhật bình luận và đánh giá
const updateProductReview = async (req, res) => {
  const { id } = req.params; // MA_CTHD
  const { BINH_LUAN, DANH_GIA } = req.body; // Dữ liệu từ body request

  try {
    // Kiểm tra xem dữ liệu có tồn tại không
    if (!BINH_LUAN && !DANH_GIA) {
      return res.status(400).json({
        EM: "Vui lòng cung cấp ít nhất một trong các thông tin: Bình luận hoặc Đánh giá",
        EC: 1,
      });
    }

    // Thực hiện truy vấn cập nhật
    const [result] = await pool.execute(
      `UPDATE chi_tiet_hoa_don 
       SET BINH_LUAN = ?, DANH_GIA = ? 
       WHERE MA_CTHD = ?`,
      [BINH_LUAN, DANH_GIA, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        EM: "Không tìm thấy chi tiết hóa đơn để cập nhật",
        EC: 1,
      });
    }

    return res.status(200).json({
      EM: "Cập nhật bình luận và đánh giá thành công",
      EC: 0,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật bình luận và đánh giá:", error);
    return res.status(500).json({
      EM: "Lỗi hệ thống khi cập nhật bình luận và đánh giá",
      EC: -1,
    });
  }
};
module.exports = {
  onAddComment,
  getProductReviews,
  updateProductReview,
};
