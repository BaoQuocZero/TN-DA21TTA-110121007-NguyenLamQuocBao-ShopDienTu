const connection = require("../../config/database");

const laydanhsachgamemoiramat = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      "SELECT * FROM `sanpham` order by MASP DESC"
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

const laydanhsach4gamegiamgianhieunhat = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      `SELECT sanpham.*,giam_gia.GIA_TRI_GIAM_GIA, sanpham.DON_GIA * (1 - giam_gia.GIA_TRI_GIAM_GIA / 100) AS GIA_SAU_GIAM
      FROM sanpham,co_giam_gia,giam_gia 
      where sanpham.MASP = co_giam_gia.MASP 
      and giam_gia.MA_GIAM_GIA = co_giam_gia.MA_GIAM_GIA 
      order by giam_gia.GIA_TRI_GIAM_GIA DESC limit 4`
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm giảm giá thành công",
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

const laydanhsachcacgamengaunhien = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      `SELECT * 
        FROM sanpham 
        ORDER BY RAND() 
        LIMIT 4;
    `
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm ngẫu nhiên thành công",
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

const laydanhsach5gamebanchaynhat = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      `SELECT sanpham.*, COUNT(chi_tiet_hoa_don.MASP) AS so_lan_xuat_hien
FROM sanpham
LEFT JOIN chi_tiet_hoa_don ON sanpham.MASP = chi_tiet_hoa_don.MASP
GROUP BY sanpham.MASP
ORDER BY so_lan_xuat_hien DESC
LIMIT 5;
    `
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm ngẫu nhiên thành công",
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

const laydanhsach5gamemacnhat = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      `SELECT sanpham.* 
      from sanpham
ORDER BY DON_GIA DESC
LIMIT 5;
    `
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm ngẫu nhiên thành công",
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

const timkiem5gametheoten = async (req, res) => {
  try {
    const TENSP = req.body.TENSP;
    const [results, fields] = await connection.execute(
      `SELECT sanpham.*
FROM sanpham
WHERE sanpham.TENSP LIKE CONCAT('%', ?, '%')
LIMIT 5;
    `,
      [TENSP]
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm ngẫu nhiên thành công",
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

const danhsach5gameyeuthichnhat = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      `SELECT sanpham.*, COUNT(yeu_thich.ID_SAN_PHAM) AS SO_LAN
FROM sanpham
JOIN yeu_thich ON sanpham.MASP = yeu_thich.ID_SAN_PHAM
GROUP BY sanpham.MASP
ORDER BY count DESC
LIMIT 5;
    `
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm ngẫu nhiên thành công",
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

const danhsachusermuahang = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      `SELECT 
    khachhang.MA_KH AS ma_khach_hang,
    khachhang.TEN_KHACH_HANG AS ten_khach_hang,
    khachhang.TEN_DANG_NHAP,
    khachhang.SDT_KH,
    COUNT(chi_tiet_hoa_don.MAHD) AS so_luong_dat_hang,
    SUM(chi_tiet_hoa_don.GIA_SP_KHI_MUA) AS tong_tien
FROM 
    hoadon
JOIN 
    chi_tiet_hoa_don ON hoadon.MAHD = chi_tiet_hoa_don.MAHD
JOIN 
    khachhang ON hoadon.MA_KH = khachhang.MA_KH
GROUP BY 
    khachhang.MA_KH, khachhang.TEN_KHACH_HANG;`
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm ngẫu nhiên thành công",
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

const tongsoluongcuatop3 = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      `WITH ProductRank AS (
    SELECT 
        sanpham.TENSP,
        COUNT(*) AS so_luong -- Đếm số dòng trong bảng chi_tiet_hoa_don cho mỗi sản phẩm
    FROM 
        chi_tiet_hoa_don
    JOIN 
        sanpham ON chi_tiet_hoa_don.MASP = sanpham.MASP
    GROUP BY 
        sanpham.TENSP
),
Top3Products AS (
    SELECT 
        TENSP AS nhom_san_pham,
        so_luong
    FROM 
        ProductRank
    ORDER BY 
        so_luong DESC
    LIMIT 3
),
Others AS (
    SELECT 
        'Khác' AS nhom_san_pham,
        SUM(so_luong) AS so_luong
    FROM 
        ProductRank
    WHERE 
        TENSP NOT IN (SELECT nhom_san_pham FROM Top3Products)
)
SELECT 
    nhom_san_pham,
    so_luong
FROM (
    SELECT * FROM Top3Products
    UNION ALL
    SELECT * FROM Others
) AS final_result;

`
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm ngẫu nhiên thành công",
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

const danhsachordertheotime = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      `SELECT 
    CONCAT('Tháng ', months.thang) AS thang,
    IFNULL(COUNT(hoadon.MAHD), 0) AS so_luong_hoa_don
FROM 
    (SELECT 1 AS thang UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION 
     SELECT 11 UNION SELECT 12) AS months
LEFT JOIN 
    hoadon ON MONTH(hoadon.NGAY_LAP_HOA_DON) = months.thang
    AND hoadon.NGAY_LAP_HOA_DON BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY 
    months.thang
ORDER BY 
    months.thang;
`
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm ngẫu nhiên thành công",
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

const laytongsoluongnhieunhat = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      `SELECT 
    SUM(GIA_SP_KHI_MUA) AS tong_tien
FROM 
    chi_tiet_hoa_don;

`
    );

    const [results2, fields2] = await connection.execute(
      `SELECT 
    khachhang.MA_KH AS ma_khach_hang,
    khachhang.TEN_KHACH_HANG AS ten_khach_hang,
    COUNT(hoadon.MAHD) AS so_luong_hoa_don
FROM 
    hoadon
JOIN 
    khachhang ON hoadon.MA_KH = khachhang.MA_KH
GROUP BY 
    khachhang.MA_KH, khachhang.TEN_KHACH_HANG
ORDER BY 
    so_luong_hoa_don DESC
LIMIT 1;
`
    );

    const [results3, fields3] = await connection.execute(
      `SELECT 
    SUM(chi_tiet_hoa_don.GIA_SP_KHI_MUA) AS tong_tien_hom_nay
FROM 
    hoadon
JOIN 
    chi_tiet_hoa_don ON hoadon.MAHD = chi_tiet_hoa_don.MAHD
WHERE 
    DATE(hoadon.NGAY_LAP_HOA_DON) = CURDATE();

`
    );

    const [results4, fields4] = await connection.execute(
      `SELECT 
    SUM(chi_tiet_hoa_don.GIA_SP_KHI_MUA) AS tong_tien_thang_nay
FROM 
    hoadon
JOIN 
    chi_tiet_hoa_don ON hoadon.MAHD = chi_tiet_hoa_don.MAHD
WHERE 
    YEAR(hoadon.NGAY_LAP_HOA_DON) = YEAR(CURDATE()) 
    AND MONTH(hoadon.NGAY_LAP_HOA_DON) = MONTH(CURDATE());

`
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm ngẫu nhiên thành công",
      EC: 1,
      DT: { results, results2, results3, results4 },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Lỗi server nội bộ",
      error: error.message,
    });
  }
};

module.exports = {
  laydanhsachgamemoiramat,
  laydanhsach4gamegiamgianhieunhat,
  laydanhsachcacgamengaunhien,
  danhsach5gameyeuthichnhat,
  laydanhsach5gamebanchaynhat,
  laydanhsach5gamemacnhat,
  timkiem5gametheoten,
  danhsachusermuahang,
  tongsoluongcuatop3,
  danhsachordertheotime,
  laytongsoluongnhieunhat,
};
