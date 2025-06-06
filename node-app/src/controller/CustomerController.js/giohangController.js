const connection = require("../../config/database");

const getAllCartItems = async (req, res) => {
  try {
    const maKhachHang = req.body.MA_KH; // Lấy mã khách hàng từ body request

    // Truy vấn danh sách sản phẩm trong giỏ hàng (chỉ lấy một bản ghi cho mỗi sản phẩm)
    const [results] = await connection.execute(
      `SELECT sanpham.MASP, 
       sanpham.TENSP, 
       sanpham.DON_GIA, 
       sanpham.NHA_SAN_XUAT, 
       sanpham.ANH_SP, 
       sanpham.GHI_CHU_SP, 
       sanpham.TRANG_THAI_SAN_PHAM,
       GROUP_CONCAT(DISTINCT theloai.MATL ORDER BY theloai.MATL) AS MATL, -- Gộp mã thể loại
       GROUP_CONCAT(DISTINCT theloai.TENTL ORDER BY theloai.MATL) AS TENTL, -- Gộp tên thể loại
       GROUP_CONCAT(DISTINCT theloai.MO_TA_TL ORDER BY theloai.MATL) AS MO_TA_TL, -- Gộp mô tả thể loại
       GROUP_CONCAT(DISTINCT theloai.GHI_CHU_TL ORDER BY theloai.MATL) AS GHI_CHU_TL -- Gộp ghi chú thể loại
FROM sanpham
LEFT JOIN  gio_hang ON sanpham.MASP = gio_hang.MASP
 LEFT  JOIN khachhang ON khachhang.MA_KH = gio_hang.MA_KH
 LEFT JOIN thuoc_loai ON sanpham.MASP = thuoc_loai.MASP
 LEFT JOIN theloai ON thuoc_loai.MATL = theloai.MATL
WHERE khachhang.MA_KH = ?
GROUP BY sanpham.MASP, sanpham.TENSP, sanpham.DON_GIA, sanpham.NHA_SAN_XUAT, sanpham.ANH_SP, sanpham.GHI_CHU_SP, sanpham.TRANG_THAI_SAN_PHAM;
`,
      [maKhachHang]
    );

    // Truy vấn tổng số lượng sản phẩm và tổng tiền trong giỏ hàng
    const [results_dem1] = await connection.execute(
      `SELECT SUM(sanpham.DON_GIA * dem.so_luong_san_pham) AS tong_tien,
              SUM(dem.so_luong_san_pham) AS tong_so_luong
       FROM (
         SELECT gio_hang.MASP, COUNT(gio_hang.MASP) AS so_luong_san_pham
         FROM gio_hang
         JOIN khachhang ON khachhang.MA_KH = gio_hang.MA_KH
         WHERE khachhang.MA_KH = ?
         GROUP BY gio_hang.MASP
       ) AS dem
       JOIN sanpham ON sanpham.MASP = dem.MASP`,
      [maKhachHang]
    );

    const results_dem = results_dem1[0];
    console.log("results", results);
    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm trong giỏ hàng thành công",
      EC: 1,
      DT: {
        results, // Danh sách sản phẩm kèm thông tin chi tiết và tổng số lượng
        results_dem, // Tổng số lượng và tổng tiền
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Lỗi server nội bộ",
      error: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { MANGUOIDUNG, MASP, NGAY_CAP_NHAT_GIOHANG } = req.body;
    console.log("req.body", req.body);
    // Kiểm tra xem mã người dùng và mã sản phẩm có tồn tại không
    if (!MANGUOIDUNG || !MASP) {
      return res.status(200).json({
        EM: "Mã người dùng hoặc mã sản phẩm không tồn tại",
        EC: 0,
        DT: [],
      });
    }

    const [existingOrder] = await connection.execute(
      `
    SELECT 1 
    FROM chi_tiet_hoa_don c 
    JOIN hoadon h ON c.MAHD = h.MAHD
    WHERE h.MA_KH = ? 
      AND c.MASP = ? 
      AND h.GHI_CHU_HOA_DON = 'Giao dịch thành công';
    `,
      [MANGUOIDUNG, MASP]
    );

    if (existingOrder.length > 0) {
      return res.status(400).json({
        EM: `Bạn đã mua sản phẩm này rồi!`,
        EC: -1,
      });
    }
    const formattedDate = new Date(NGAY_CAP_NHAT_GIOHANG)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Bước 1: Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const [existingProduct] = await connection.execute(
      `SELECT * FROM gio_hang WHERE MA_KH = ? AND MASP = ?`,
      [MANGUOIDUNG, MASP]
    );

    if (existingProduct.length > 0) {
      return res.status(200).json({
        EM: "Sản phẩm đã có trong giỏ hàng",
        EC: 0,
        DT: [],
      });
    }

    // Bước 2: Nếu sản phẩm chưa có trong giỏ, thêm vào giỏ hàng
    const [insertResult] = await connection.execute(
      "INSERT INTO `gio_hang` (`MA_KH`, `MASP`, `NGAY_CAP_NHAT`) VALUES (?, ?, ?)",
      [MANGUOIDUNG, MASP, formattedDate]
    );

    // Bước 3: Tính tổng số lượng sản phẩm trong giỏ hàng của người dùng
    const [totalResults] = await connection.execute(
      `SELECT COUNT(MASP) AS totalQuantity
       FROM gio_hang
       WHERE MA_KH = ?`,
      [MANGUOIDUNG]
    );

    // Bước 4: Trả về phản hồi với tổng số sản phẩm trong giỏ hàng
    const totalQuantity = totalResults[0].totalQuantity;

    return res.status(200).json({
      EM: "Thêm vào giỏ hàng thành công",
      EC: 1,
      DT: totalQuantity,
      totalQuantity: totalQuantity,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(200).json({
      EM: "Đã xảy ra lỗi",
      EC: -1,
      DT: [],
    });
  }
};

// Đang sử dụng
const removeCartItem = async (req, res) => {
  try {
    const { MA_KH, MASP } = req.body;

    const [deleteResult] = await connection.execute(
      "DELETE FROM `gio_hang` WHERE `MA_KH` = ? AND `MASP` = ?",
      [MA_KH, MASP]
    );
    return res.status(200).json({
      EM: " thành công",
      EC: 1,
      DT: deleteResult,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(200).json({
      EM: " thành công",
      EC: -1,
      DT: [],
    });
  }
};

module.exports = {
  getAllCartItems,
  addToCart,

  removeCartItem,
};
