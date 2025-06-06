const connection = require("../../config/database");

const laydanhsachgamecanhan = async (req, res) => {
  try {
    const { MA_KH } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!MA_KH) {
      return res.status(400).json({
        EM: "Thiếu MA_KH trong yêu cầu",
        EC: 0,
        DT: [],
      });
    }

    const [results] = await connection.execute(
      `
      SELECT 
        hoadon.MAHD,
        hoadon.MA_KH,
        sanpham.MASP,
        sanpham.TENSP AS title,
        sanpham.ANH_SP AS image,
        chi_tiet_hoa_don.SO_LUONG,
        chi_tiet_hoa_don.GIA_SP_KHI_MUA,
        chi_tiet_hoa_don.GIAM_GIA_KHI_MUA,
        chi_tiet_hoa_don.GHI_CHU_CTHD,
        chi_tiet_hoa_don.BINH_LUAN,
        chi_tiet_hoa_don.DANH_GIA,
        chi_tiet_hoa_don.MA_CTHD,
        GROUP_CONCAT(DISTINCT theloai.TENTL ORDER BY theloai.TENTL SEPARATOR ', ') AS categories
      FROM 
        hoadon
      JOIN 
        chi_tiet_hoa_don ON hoadon.MAHD = chi_tiet_hoa_don.MAHD
      JOIN 
        sanpham ON sanpham.MASP = chi_tiet_hoa_don.MASP
      LEFT JOIN 
        thuoc_loai ON sanpham.MASP = thuoc_loai.MASP
      LEFT JOIN 
        theloai ON theloai.MATL = thuoc_loai.MATL
      WHERE 
        hoadon.MA_KH = ?
        AND hoadon.GHI_CHU_HOA_DON = 'Giao dịch thành công'
      GROUP BY 
        chi_tiet_hoa_don.MA_CTHD,
        hoadon.MAHD,
        hoadon.MA_KH,
        sanpham.MASP,
        sanpham.TENSP,
        sanpham.ANH_SP;
      `,
      [MA_KH]
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

module.exports = { laydanhsachgamecanhan, laydanhsachgamecanhanwishlist };
