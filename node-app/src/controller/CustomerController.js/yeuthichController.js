const connection = require("../../config/database");

const taoSanphamYeuthich = async (req, res) => {
  try {
    const { MASP, MA_KH } = req.body;
    console.log("req.body", req.body);
    const [results, fields] = await connection.execute(
      "SELECT * FROM `yeu_thich` where ID_SAN_PHAM = ? and ID_NGUOI_DUNG = ?",
      [MASP, MA_KH]
    );

    if (results.length > 0) {
      return res.status(400).json({
        EM: "Bạn đã có thêm game này vào yêu thích rồi ",
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
      [MA_KH, MASP]
    );

    if (existingOrder.length > 0) {
      return res.status(400).json({
        EM: `Bạn đã mua sản phẩm này rồi!`,
        EC: -1,
      });
    }
    const [insertResult] = await connection.execute(
      "INSERT INTO `yeu_thich` (`ID_SAN_PHAM`, `ID_NGUOI_DUNG` ,`NGAY_YEU_THICH`) VALUES (?, ?,NOW())",
      [MASP, MA_KH]
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Yêu thích game !!",
      EC: 1,
      DT: insertResult,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Lỗi server nội bộ",
      error: error.message,
    });
  }
};

const xemSanphamYeuthichcuabanthan = async (req, res) => {
  try {
    const { MA_KH } = req.body;
    console.log("MA_KH", MA_KH);
    // Kết hợp dữ liệu từ bảng `yeu_thich` và `sanpham`
    const [results, fields] = await connection.execute(
      `
    SELECT 
    sanpham.MASP, 
    sanpham.TENSP, 
    sanpham.DON_GIA, 
    sanpham.NHA_SAN_XUAT, 
    sanpham.ANH_SP, 
    sanpham.GHI_CHU_SP, 
    sanpham.TRANG_THAI_SAN_PHAM,
    yeu_thich.ID_YEU_THICH, 
    yeu_thich.ID_SAN_PHAM, 
    yeu_thich.ID_NGUOI_DUNG, 
    yeu_thich.NGAY_YEU_THICH,
    GROUP_CONCAT(DISTINCT theloai.MATL ORDER BY theloai.MATL) AS MATL, -- Gộp mã thể loại
    GROUP_CONCAT(DISTINCT theloai.TENTL ORDER BY theloai.MATL) AS TENTL, -- Gộp tên thể loại
    GROUP_CONCAT(DISTINCT theloai.MO_TA_TL ORDER BY theloai.MATL) AS MO_TA_TL, -- Gộp mô tả thể loại
    GROUP_CONCAT(DISTINCT theloai.GHI_CHU_TL ORDER BY theloai.MATL) AS GHI_CHU_TL -- Gộp ghi chú thể loại
FROM 
    sanpham
JOIN 
    yeu_thich ON sanpham.MASP = yeu_thich.ID_SAN_PHAM 
LEFT JOIN 
    thuoc_loai ON sanpham.MASP = thuoc_loai.MASP
LEFT JOIN 
    theloai ON thuoc_loai.MATL = theloai.MATL
WHERE 
    yeu_thich.ID_NGUOI_DUNG = ? -- Lọc theo người dùng
GROUP BY 
    sanpham.MASP, 
    sanpham.TENSP, 
    sanpham.DON_GIA, 
    sanpham.NHA_SAN_XUAT, 
    sanpham.ANH_SP, 
    sanpham.GHI_CHU_SP, 
    sanpham.TRANG_THAI_SAN_PHAM, 
    yeu_thich.ID_YEU_THICH, 
    yeu_thich.ID_SAN_PHAM, 
    yeu_thich.ID_NGUOI_DUNG, 
    yeu_thich.NGAY_YEU_THICH;

      `,
      [MA_KH]
    );

    // Trả về danh sách sản phẩm yêu thích
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm yêu thích thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Lỗi server nội bộ",
      error: error.message,
    });
  }
};

const xoaSanphamYeuthichcuabanthan = async (req, res) => {
  try {
    const { MA_KH, MASP } = req.body;
    const [results, fields] = await connection.execute(
      "delete from yeu_thich where ID_NGUOI_DUNG = ? and ID_SAN_PHAM = ?",
      [MA_KH, MASP]
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xóa khỏi list thành công nè hehe",
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
const addCartRemoveWish = async (req, res) => {
  try {
    const { userId, productId, updateDate } = req.body;

    // Kiểm tra thông tin
    if (!userId || !productId || !updateDate) {
      return res.status(400).json({ EC: -1, EM: "Thiếu thông tin đầu vào" });
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const checkCartQuery = `
      SELECT 1 
      FROM gio_hang 
      WHERE MA_KH = ? AND MASP = ?;
    `;
    const [checkCartResult] = await connection.query(checkCartQuery, [
      userId,
      productId,
    ]);

    if (checkCartResult.length > 0) {
      return res.status(400).json({
        EC: 0,
        EM: "Sản phẩm đã có trong giỏ hàng",
      });
    }

    // Thêm sản phẩm vào giỏ hàng
    const addToCartQuery = `
      INSERT INTO gio_hang (MA_KH, MASP, NGAY_CAP_NHAT)
      VALUES (?, ?, ?);
    `;
    await connection.query(addToCartQuery, [userId, productId, updateDate]);

    // Xóa sản phẩm khỏi danh sách yêu thích
    const deleteFromWishlistQuery = `
      DELETE FROM yeu_thich WHERE ID_NGUOI_DUNG = ? AND ID_SAN_PHAM = ?;
    `;
    await connection.query(deleteFromWishlistQuery, [userId, productId]);

    // Lấy số lượng giỏ hàng cập nhật
    const cartCountQuery = `SELECT COUNT(*) AS totalQuantity FROM gio_hang WHERE MA_KH = ?;`;
    const [cartCountResult] = await connection.query(cartCountQuery, [userId]);

    // Phản hồi thành công
    return res.status(200).json({
      EC: 1,
      EM: "Thêm vào giỏ hàng và xóa khỏi yêu thích thành công",
      totalQuantity: cartCountResult[0].totalQuantity,
    });
  } catch (error) {
    console.error("Error in add-cart/delete-wish:", error);
    return res.status(500).json({ EC: -1, EM: "Lỗi máy chủ" });
  }
};
const checkProductStatus = async (req, res) => {
  try {
    const { userId, productIds } = req.body;
    console.log("productIds", productIds);

    if (!userId || !productIds || !Array.isArray(productIds)) {
      return res.status(400).json({
        EC: -1,
        EM: "Thiếu thông tin đầu vào hoặc productIds không hợp lệ",
      });
    }

    // Truy vấn danh sách sản phẩm yêu thích
    const favoriteQuery = `
      SELECT ID_SAN_PHAM 
      FROM yeu_thich 
      WHERE ID_NGUOI_DUNG = ? AND ID_SAN_PHAM IN (?);
    `;
    const [favoriteResults] = await connection.query(favoriteQuery, [
      userId,
      productIds,
    ]);
    const favoriteProductIds = favoriteResults.map((row) => row.ID_SAN_PHAM);

    // Truy vấn danh sách sản phẩm đã mua với điều kiện "Giao dịch thành công"
    const purchasedQuery = `
      SELECT DISTINCT ct.MASP
      FROM chi_tiet_hoa_don ct
      JOIN hoadon hd ON ct.MAHD = hd.MAHD
      WHERE hd.MA_KH = ? 
        AND ct.MASP IN (?) 
        AND hd.GHI_CHU_HOA_DON = "Giao dịch thành công";
    `;
    const [purchasedResults] = await connection.query(purchasedQuery, [
      userId,
      productIds,
    ]);
    console.log("purchasedResults", purchasedResults);
    const purchasedProductIds = purchasedResults.map((row) => row.MASP);
    console.log("purchasedProductIds", purchasedProductIds);

    // Tạo dữ liệu trả về với favoriteStatus và buyStatus
    const productStatus = productIds.map((productId) => ({
      MASP: productId,
      favoriteStatus: favoriteProductIds.includes(productId), // true nếu đã yêu thích
      buyStatus: purchasedProductIds.includes(productId), // true nếu đã mua (giao dịch thành công)
    }));

    return res.status(200).json({
      EC: 1,
      EM: "Kiểm tra trạng thái sản phẩm thành công",
      data: productStatus,
    });
  } catch (error) {
    console.error("Error in checkProductStatus:", error);
    return res.status(500).json({ EC: -1, EM: "Lỗi máy chủ" });
  }
};
module.exports = {
  taoSanphamYeuthich,
  xemSanphamYeuthichcuabanthan,
  xoaSanphamYeuthichcuabanthan,
  addCartRemoveWish,
  checkProductStatus,
};
