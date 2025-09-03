const connection = require("../../config/database");

const LichSuMuaHangCaNhan = async (req, res) => {
  try {
    const { ID_USER } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ID_USER) {
      return res.status(400).json({
        EM: "Thiếu ID_USER trong yêu cầu",
        EC: 0,
        DT: [],
      });
    }

    const [results] = await connection.execute(
      `
      SELECT 
      user.ID_USER,
      orders.*
      FROM user 
      JOIN orders
      WHERE user.ID_USER = ?
      `,
      [ID_USER]
    );

    return res.status(200).json({
      EM: "Xem thông tin chi tiết hóa đơn thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Lỗi server nội bộ",
      error: error.message,
    });
  }
};

const laydanhsachgamecanhanwishlist = async (req, res) => {
  try {
    const MA_KH = req.body.MA_KH;
    const [results, fields] = await connection.execute(
      `SELECT 
    yeu_thich.ID_SAN_PHAM,
    sanpham.TENSP as title,
    sanpham.ANH_SP as image,
    GROUP_CONCAT(DISTINCT theloai.TENTL ORDER BY theloai.TENTL SEPARATOR ', ') AS categories
FROM 
    yeu_thich
JOIN 
    sanpham ON yeu_thich.ID_SAN_PHAM = sanpham.MASP
JOIN 
    thuoc_loai ON sanpham.MASP = thuoc_loai.MASP
JOIN 
    theloai ON thuoc_loai.MATL = theloai.MATL
WHERE 
    yeu_thich.ID_NGUOI_DUNG = ?
GROUP BY 
    yeu_thich.ID_SAN_PHAM, sanpham.TENSP;
`,
      [MA_KH]
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm mới ra mắt thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Lỗi server nội bộ",
      error: error.message,
    });
  }
};

module.exports = { LichSuMuaHangCaNhan, laydanhsachgamecanhanwishlist };
