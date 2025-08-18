const pool = require("../../config/database"); // Đảm bảo `connection` được import từ tệp kết nối cơ sở dữ liệu của bạn

// 1. Lấy danh sách bình luận
const getProductReviews = async (req, res) => {
  const { id } = req.params; // Lấy MASP từ URL
  console.log("id", id);

  try {
    // Truy vấn đánh giá, bình luận và thông tin khách hàng theo MASP
    const [results] = await pool.execute(
      `SELECT 
        kh.TEN_KHACH_HANG AS HO_TEN, 
        kh.SDT_KH AS SDT,
        kh.AVATAR,
        kh.DIA_CHI AS DIA_CHI,
        kh.MA_PHAN_QUYEN, 
        pq.TEN_PHAN_QUYEN AS VAI_TRO,
        hd.NGAY_LAP_HOA_DON AS NGAY_MUA,  
        cthd.DANH_GIA, 
        cthd.BINH_LUAN
      FROM chi_tiet_hoa_don cthd
      JOIN hoadon hd ON cthd.MAHD = hd.MAHD
      JOIN khachhang kh ON hd.MA_KH = kh.MA_KH
      LEFT JOIN phan_quyen pq ON kh.MA_PHAN_QUYEN = pq.MA_PHAN_QUYEN
      WHERE cthd.MASP = ? 
      AND (cthd.DANH_GIA IS NOT NULL OR cthd.BINH_LUAN IS NOT NULL)`,
      [id]
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
  getProductReviews,
  updateProductReview,
};
