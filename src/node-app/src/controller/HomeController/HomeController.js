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
      `
      SELECT 
          u.ID_USER,
          u.FIRSTNAME,
          u.LASTNAME,
          u.EMAIL,
          u.PHONENUMBER,
          COUNT(o.ID_ORDER) AS TOTAL_ORDERS,
          SUM(o.TOTALORDERPRICE) AS TOTAL_SPENT
      FROM user u
      JOIN orders o ON o.ID_USER = u.ID_USER
      GROUP BY u.ID_USER, u.FIRSTNAME, u.LASTNAME, u.EMAIL, u.PHONENUMBER
      ORDER BY MAX(o.CREATEAT) DESC;
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

const tongsoluongcuatop3 = async (req, res) => {
  try {
    const [results, fields] = await connection.execute(
      `
SELECT 
    b.ID_BRAND,
    b.NAME AS BRAND_NAME,
    SUM(oi.QUANTITY) AS TOTAL_SOLD
FROM brand b
JOIN product p ON p.ID_BRAND = b.ID_BRAND
JOIN product_details pd ON pd.ID_PRODUCT = p.ID_PRODUCT
JOIN order_item oi ON oi.ID_PRODUCTDETAILS = pd.ID_PRODUCTDETAILS
GROUP BY b.ID_BRAND, b.NAME
ORDER BY TOTAL_SOLD DESC;

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
      `
SELECT 
    DATE_FORMAT(oi.CREATEAT, '%Y-%m') AS MONTH,
    SUM(oi.QUANTITY) AS TOTAL_SOLD,
    SUM(oi.TOTAL_PRICE) AS TOTAL_REVENUE,
    SUM(oi.QUANTITY * pd.Import_Price) AS TOTAL_COST,
    SUM(oi.TOTAL_PRICE) - SUM(oi.QUANTITY * pd.Import_Price) AS PROFIT
FROM order_item oi
JOIN product_details pd ON oi.ID_PRODUCTDETAILS = pd.ID_PRODUCTDETAILS
JOIN product p ON pd.ID_PRODUCT = p.ID_PRODUCT
JOIN orders o ON o.ID_ORDER = oi.ID_ORDER
GROUP BY DATE_FORMAT(oi.CREATEAT, '%Y-%m')
ORDER BY MONTH DESC;
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
      `
SELECT 
    SUM(o.TOTALORDERPRICE) AS tong_tien
FROM orders o;
`
    );

    const [results2, fields2] = await connection.execute(
      `
SELECT 
    u.ID_USER,
    u.FIRSTNAME,
    u.LASTNAME,
    u.EMAIL,
    u.PHONENUMBER,
    COUNT(o.ID_ORDER) AS TOTAL_ORDERS
FROM user u
JOIN orders o ON o.ID_USER = u.ID_USER
GROUP BY u.ID_USER, u.FIRSTNAME, u.LASTNAME, u.EMAIL, u.PHONENUMBER
ORDER BY TOTAL_ORDERS DESC
LIMIT 1;

`
    );

    const [results3, fields3] = await connection.execute(
      `
SELECT 
    SUM(order_item.TOTAL_PRICE) AS tong_tien_hom_nay
FROM 
    order_item
JOIN 
    orders ON orders.ID_ORDER = order_item.ID_ORDER
WHERE 
    DATE(orders.CREATEAT) = CURDATE();
`
    );

    const [results4, fields4] = await connection.execute(
      `
SELECT 
    SUM(oi.TOTAL_PRICE) AS tong_tien_thang_nay
FROM order_item oi
JOIN orders o ON o.ID_ORDER = oi.ID_ORDER
WHERE YEAR(o.CREATEAT) = YEAR(CURDATE())
  AND MONTH(o.CREATEAT) = MONTH(CURDATE());

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

const DuLieu_chartData = async (req, res) => {
  try {
    const [results] = await connection.execute(`
      SELECT 
          b.NAME AS BRAND,
          DATE_FORMAT(oi.CREATEAT, '%Y-%m') AS MONTH,
          COUNT(*) AS TOTAL_SOLD
      FROM order_item oi
      JOIN product_details pd ON oi.ID_PRODUCTDETAILS = pd.ID_PRODUCTDETAILS
      JOIN product p ON pd.ID_PRODUCT = p.ID_PRODUCT
      JOIN brand b ON b.ID_BRAND = p.ID_BRAND
      GROUP BY b.NAME, DATE_FORMAT(oi.CREATEAT, '%Y-%m')
      ORDER BY MONTH ASC;
    `);

    const months = [...new Set(results.map(r => r.MONTH))].sort();
    const brands = [...new Set(results.map(r => r.BRAND))];

    // Tạo map để lookup nhanh
    const map = new Map();
    for (const r of results) {
      map.set(`${r.BRAND}|${r.MONTH}`, Number(r.TOTAL_SOLD) || 0);
    }

    // Tạo ma trận z (brands × months)
    const z = brands.map(brand =>
      months.map(month => map.get(`${brand}|${month}`) || 0)
    );

    return res.status(200).json({
      EC: 1,
      EM: "Lấy dữ liệu heatmap thành công",
      DT: {
        data: [
          {
            z,
            x: months,
            y: brands,
            type: "heatmap",
            colorscale: "YlGnBu",
            colorbar: {
              title: { text: "Số lượng" },
              tickformat: ",.0f"
            },
            hovertemplate:
              "Hãng: %{y}<br>Tháng: %{x}<br>Số lượng: %{z:.0f}<extra></extra>"
          }
        ],
        layout: {
          title: "Số lượng bán theo hãng và tháng",
          xaxis: { title: "Tháng" },
          yaxis: { title: "Hãng" },
          autosize: true
        }
      }
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      EC: -1,
      EM: "Lỗi server nội bộ",
      error: error.message
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
  DuLieu_chartData,
};
