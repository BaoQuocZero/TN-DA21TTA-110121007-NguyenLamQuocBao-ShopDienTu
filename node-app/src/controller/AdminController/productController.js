const {
  tao_sanpham,
  xem_tatca_sanpham,
  xoa_sanpham_id,
  sua_sanpham_id,
  xem_sanpham_id,
  uploadDaHinhAnh,
} = require("../../services/AdminServices/productSerivices");
const pool = require("../../config/database");
const tao_new_sanpham = async (req, res) => {
  try {
    const datasanpham = req.body;
    const filename = req.file ? req.file.filename : 1;

    console.log("cehc", datasanpham);

    let results = await tao_sanpham(datasanpham, filename);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const xemtatca_sanpham = async (req, res) => {
  try {
    let results = await xem_tatca_sanpham();
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const xem_sanpham_voi_id = async (req, res) => {
  try {
    const MASP = req.body.MASP;
    const MA_KHH = req.body.MA_KH;

    let results = await xem_sanpham_id(MASP, MA_KHH);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const sua_sanpham_voi_id = async (req, res) => {
  try {
    const MASP = req.params.MASP;
    const datasanpham = req.body;
    const filename = req.file ? req.file.filename : null;

    let results = await sua_sanpham_id(MASP, datasanpham, filename);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const xoa_sanpham_voi_id = async (req, res) => {
  try {
    const MASP = req.params.MASP;

    let results = await xoa_sanpham_id(MASP);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};
const getAllUseSanPham = async (req, res) => {
  try {
    const [results] = await pool.execute(`
       SELECT 
        sanpham.MASP,
        sanpham.TENSP,
        sanpham.DON_GIA,
        sanpham.NHA_SAN_XUAT,
        sanpham.ANH_SP,
        sanpham.GHI_CHU_SP,
        sanpham.TRANG_THAI_SAN_PHAM,
        sanpham.NGAY_CAP_NHAT,
        sanpham.NGAY_RA_MAT,
        GROUP_CONCAT(DISTINCT theloai.TENTL) AS TENTL,
        GROUP_CONCAT(DISTINCT theloai.MATL) AS MATL_ARRAY
      FROM sanpham
      LEFT JOIN thuoc_loai ON sanpham.MASP = thuoc_loai.MASP
      LEFT JOIN theloai ON theloai.MATL = thuoc_loai.MATL
      WHERE sanpham.TRANG_THAI_SAN_PHAM = 'Đang hoạt động'  -- Di chuyển điều kiện WHERE vào đây
      GROUP BY sanpham.MASP
      ORDER BY sanpham.NGAY_CAP_NHAT DESC; 
    `);
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      EM: "Xem thông tin sản phẩm thất bại",
      EC: -1,
      DT: [],
    });
  }
};

const getSanPhamByTheLoai_Action = async (req, res) => {
  try {
    const [results] = await pool.execute(
      `
      SELECT sp.*
      FROM sanpham sp
      INNER JOIN thuoc_loai tl ON sp.MASP = tl.MASP
      INNER JOIN theloai tlg ON tl.MATL = tlg.MATL
      WHERE tlg.TENTL = 'Action' AND sp.TRANG_THAI_SAN_PHAM = 'Đang hoạt động'
      `
    );
    return res.status(200).json({
      EM: "Lấy sản phẩm theo thể loại thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      EM: "Lấy sản phẩm theo thể loại thất bại",
      EC: -1,
      DT: [],
    });
  }
};
const getSanPhamByAdventure = async (req, res) => {
  try {
    const [results] = await pool.execute(
      `
      SELECT sp.*
      FROM sanpham sp
      INNER JOIN thuoc_loai tl ON sp.MASP = tl.MASP
      INNER JOIN theloai tlg ON tl.MATL = tlg.MATL
      WHERE tlg.TENTL = 'Adventure' AND sp.TRANG_THAI_SAN_PHAM = 'Đang hoạt động'
      `
    );
    return res.status(200).json({
      EM: "Lấy sản phẩm thể loại Adventure thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      EM: "Lấy sản phẩm thể loại Adventure thất bại",
      EC: -1,
      DT: [],
    });
  }
};
const getSanPhamByRPG = async (req, res) => {
  try {
    const [results] = await pool.execute(
      `
      SELECT sp.*
      FROM sanpham sp
      INNER JOIN thuoc_loai tl ON sp.MASP = tl.MASP
      INNER JOIN theloai tlg ON tl.MATL = tlg.MATL
      WHERE tlg.TENTL = 'RPG' AND sp.TRANG_THAI_SAN_PHAM = 'Đang hoạt động'
      `
    );
    return res.status(200).json({
      EM: "Lấy sản phẩm thể loại RPG thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      EM: "Lấy sản phẩm thể loại RPG thất bại",
      EC: -1,
      DT: [],
    });
  }
};
const getSanPhamBySimulation = async (req, res) => {
  try {
    const [results] = await pool.execute(
      `
      SELECT sp.*
      FROM sanpham sp
      INNER JOIN thuoc_loai tl ON sp.MASP = tl.MASP
      INNER JOIN theloai tlg ON tl.MATL = tlg.MATL
      WHERE tlg.TENTL = 'Simulation' AND sp.TRANG_THAI_SAN_PHAM = 'Đang hoạt động'
      `
    );
    return res.status(200).json({
      EM: "Lấy sản phẩm thể loại Simulation thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      EM: "Lấy sản phẩm thể loại Simulation thất bại",
      EC: -1,
      DT: [],
    });
  }
};
const get5BestSellingProducts = async (req, res) => {
  try {
    const [results] = await pool.execute(`
      SELECT sp.MASP, sp.TENSP, sp.DON_GIA, sp.ANH_SP, SUM(cthd.SO_LUONG) AS TOTAL_SOLD
      FROM sanpham sp
      INNER JOIN chi_tiet_hoa_don cthd ON sp.MASP = cthd.MASP
      GROUP BY sp.MASP
      ORDER BY TOTAL_SOLD DESC
      LIMIT 5
    `);
    return res.status(200).json({
      EM: "Lấy top 5 sản phẩm bán chạy nhất thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      EM: "Lấy top 5 sản phẩm bán chạy nhất thất bại",
      EC: -1,
      DT: [],
    });
  }
};
const get5TopFavoriteProducts = async (req, res) => {
  try {
    const [results] = await pool.execute(`
      SELECT 
        sp.MASP, sp.TENSP, sp.DON_GIA, sp.ANH_SP,
        COUNT(yt.ID_YEU_THICH) AS favorite_count
      FROM sanpham sp
      LEFT JOIN yeu_thich yt ON sp.MASP = yt.ID_SAN_PHAM
      WHERE sp.TRANG_THAI_SAN_PHAM = 'Đang hoạt động'
      GROUP BY sp.MASP
      ORDER BY favorite_count DESC
      LIMIT 5
    `);

    return res.status(200).json({
      EM: "Xem thông tin sản phẩm được yêu thích nhất thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting favorite products:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin sản phẩm yêu thích",
      EC: 0,
      DT: [],
    });
  }
};

const get5BestExpensiveProducts = async (req, res) => {
  try {
    const [results] = await pool.execute(`
      SELECT sp.MASP, sp.TENSP, sp.DON_GIA, sp.ANH_SP
      FROM sanpham sp
      WHERE sp.TRANG_THAI_SAN_PHAM = 'Đang hoạt động'
      ORDER BY sp.DON_GIA DESC
      LIMIT 5
    `);
    return res.status(200).json({
      EM: "Lấy top 5 sản phẩm đắt nhất thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      EM: "Lấy top 5 sản phẩm đắt nhất thất bại",
      EC: -1,
      DT: [],
    });
  }
};
const getCartTotalQuantity = async (req, res) => {
  const userId = req.params.id; // Lấy ID người dùng từ tham số đường dẫn

  try {
    // Truy vấn số lượng sản phẩm trong giỏ hàng của người dùng
    const [results] = await pool.execute(
      `
      SELECT COUNT(MASP) AS totalQuantity
      FROM GIO_HANG
      WHERE MA_KH = ?
      `,
      [userId]
    );

    if (results.length > 0) {
      return res.status(200).json({
        EM: "Lấy tổng số lượng sản phẩm trong giỏ hàng thành công",
        EC: 1,
        DT: results[0].totalQuantity, // Trả về tổng số lượng sản phẩm
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy giỏ hàng của người dùng",
        EC: 0,
        DT: 0, // Nếu không có sản phẩm, trả về 0
      });
    }
  } catch (error) {
    console.error("Error getting total cart quantity:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy tổng số lượng sản phẩm",
      EC: 0,
      DT: 0,
    });
  }
};
const get2LatestProducts = async (req, res) => {
  try {
    // Truy vấn 2 sản phẩm mới nhất theo thời gian thêm vào
    const [results] = await pool.execute(`
      SELECT 
        MASP, TENSP, DON_GIA, ANH_SP, GHI_CHU_SP
      FROM sanpham
      ORDER BY NGAY_RA_MAT DESC
      LIMIT 2
    `);

    // Log sản phẩm mới nhất để kiểm tra
    console.log("last2Products:", results);

    return res.status(200).json({
      EM: "Lấy 2 sản phẩm mới nhất thành công",
      EC: 1,
      DT: results, // Trả về 2 sản phẩm mới nhất
    });
  } catch (error) {
    console.error("Error getting latest products:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy 2 sản phẩm mới nhất",
      EC: 0,
      DT: [],
    });
  }
};

const searchSanPhamDynamic = async (req, res) => {
  try {
    const { query } = req.query; // Truy xuất từ khóa tìm kiếm
    if (!query || query.trim().length < 1) {
      return res.status(400).json({
        EM: "Từ khóa tìm kiếm phải có ít nhất 3 ký tự",
        EC: 0,
        DT: [],
      });
    }

    // Tìm kiếm theo tên sản phẩm và giới hạn 5 kết quả
    let [results] = await pool.execute(
      `
      SELECT *
      FROM sanpham
      WHERE TENSP LIKE ? AND TRANG_THAI_SAN_PHAM = 'Đang hoạt động'
      LIMIT 5
      `,
      [`%${query}%`]
    );

    return res.status(200).json({
      EM:
        results.length > 0
          ? "Tìm kiếm sản phẩm thành công"
          : "Không tìm thấy sản phẩm nào",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi tìm kiếm sản phẩm",
      EC: 0,
      DT: [],
    });
  }
};

module.exports = {
  tao_new_sanpham,
  xem_sanpham_voi_id,
  xemtatca_sanpham,
  sua_sanpham_voi_id,
  xoa_sanpham_voi_id,
  getAllUseSanPham,
  getSanPhamByTheLoai_Action,
  getSanPhamByAdventure,
  getSanPhamByRPG,
  getSanPhamBySimulation,
  get5BestSellingProducts,
  get5TopFavoriteProducts,
  get5BestExpensiveProducts,
  getCartTotalQuantity,
  get2LatestProducts,
  searchSanPhamDynamic,
};
