const connection = require("../../config/database");

const getChiTietHoaDon = async (req, res) => {
  const { id } = req.params;
  console.log("addddđ: ", id)
  try {
    const [hoaDonResults] = await connection.execute(
      `
      SELECT 
        user.ID_USER, user.ADDRESS, user.PHONENUMBER, user.FIRSTNAME, user.LASTNAME, user.EMAIL,
        orders.STATUS, orders.CREATEAT, orders.ID_ORDER, orders.PAYMENTMETHOD, orders.TOTALORDERPRICE
      FROM orders 
      JOIN order_item ON order_item.ID_ORDER = orders.ID_ORDER
      JOIN user ON user.ID_USER = orders.ID_USER
      WHERE orders.ID_ORDER = ?
      `,
      [id]
    );

    const [chiTietHoaDonResults] = await connection.execute(
      `
      SELECT 
        order_item.TOTAL_PRICE, order_item.QUANTITY, order_item.UNIT_PRICE,
        category.NAME_CATEGORY,
        brand.NAME AS BRAND_NAME,
        product_details.GALLERYPRODUCT_DETAILS, product_details.NAME_PRODUCTDETAILS,
        product.SHORTDESCRIPTION
      FROM orders 
      JOIN order_item ON order_item.ID_ORDER = orders.ID_ORDER
      JOIN user ON user.ID_USER = orders.ID_USER
      JOIN product_details ON product_details.ID_PRODUCTDETAILS = order_item.ID_PRODUCTDETAILS
      JOIN product ON product.ID_PRODUCT = product_details.ID_PRODUCT 
      JOIN brand ON product.ID_BRAND = brand.ID_BRAND
      JOIN category ON category.ID_CATEGORY = product.ID_CATEGORY
      WHERE orders.ID_ORDER = ?
      `,
      [id]
    );

    if (hoaDonResults.length > 0) {
      return res.status(200).json({
        EM: "Lấy chi tiết hóa đơn thành công",
        EC: 1,
        DT: {
          hoaDon: hoaDonResults[0],  // thông tin hóa đơn (đơn hàng, user)
          chiTietHoaDon: chiTietHoaDonResults, // danh sách sản phẩm
        },
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy hóa đơn này",
        EC: 0,
        DT: {},
      });
    }
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: {},
    });
  }
};

//Giao dịch thành công
const getChiTietHoaDonTheoNguoiDung_Success = async (req, res) => {
  const { id } = req.params; // ID_NGUOI_DUNG được truyền vào
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,  dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG, 
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
          dh.ID_NGUOI_DUNG = ? AND dh.TRANG_THAI_DON_HANG = 'Giao dịch thành công'
           ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`,
      [id]
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Kết quả cuối cùng
    const results = [];

    for (const donHang of donHangResults) {
      // Lấy chi tiết hóa đơn của từng đơn hàng
      const [chiTietHoaDonResults] = await connection.execute(
        `SELECT 
    sp.ID_SAN_PHAM, 
    sp.ID_THUONG_HIEU, 
    sp.ID_DANH_MUC, 
    sp.GIOI_TINH_ID, 
    sp.CHAT_LIEU_ID_,
    sp.TEN_SAN_PHAM, 
    sp.GIA, 
    sp.MO_TA_SAN_PHAM, 
    sp.HINH_ANH_SANPHAM, 
    sp.TRANG_THAI_SANPHAM, 
    sp.NGAY_TAO_SANPHAM, 
    sp.NGAY_CAP_NHAT_SANPHAM, 
    sp.SO_LUONG_SANPHAM,
    gt.TEN_GIOI_TINH,
    dm.TEN_DANH_MUC, 
    dm.MO_TA_LOAI_DANH_MUC,
    cl.TEN_CHAT_LIEU_, 
    cl.MO_TA_CHAT_LIEU,
    th.TEN_THUONG_HIEU,
    pc.ID_PHUONG_CACH, 
    pc.TEN_PHONG_CACH, 
    ms.MAU_SAC_ID, 
    ms.TEN_MAU_SAC, 
    mdsd.ID_MUC_DICH_SU_DUNG, 
    mdsd.TEN_MUC_DICH_SU_DUNG, 
    kc.ID_KICH_CO, 
    kc.KICH_CO, 
    cthd.ID_CHI_TIET_HOA_DON, 
    cthd.SO_LUONG_SP, 
    cthd.DANH_GIA,
    cthd.GIA_SAN_PHAM_CHI_TIET
FROM 
    SAN_PHAM sp
LEFT JOIN 
    GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN 
    LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN 
    CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN 
    THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
LEFT JOIN 
    PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
LEFT JOIN 
    PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
LEFT JOIN 
    SAN_PHAM_CHI_TIET spct ON sp.ID_SAN_PHAM = spct.ID_SAN_PHAM
LEFT JOIN 
    MAU_SAC ms ON spct.MAU_SAC_ID = ms.MAU_SAC_ID
LEFT JOIN 
    MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
LEFT JOIN 
    MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
LEFT JOIN 
    KICH_CO kc ON spct.ID_KICH_CO = kc.ID_KICH_CO
LEFT JOIN 
    CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM_CHI_TIET = spct.ID_SAN_PHAM_CHI_TIET
WHERE 
    cthd.ID_DON_HANG IN (?) 
`,
        [donHang.ID_DON_HANG]
      );
      // Ghép kết quả lại với nhau
      // Thêm thông tin chi tiết hóa đơn vào từng đơn hàng
      results.push({
        ...donHang,
        chiTietHoaDon: chiTietHoaDonResults,
      });
    }

    // Trả về kết quả
    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

//Đã hủy
const getChiTietHoaDonTheoNguoiDung_Cancel = async (req, res) => {
  const { id } = req.params; // ID_NGUOI_DUNG được truyền vào
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
          dh.ID_NGUOI_DUNG = ? AND dh.TRANG_THAI_DON_HANG = 'Đã hủy' 
           ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`,
      [id]
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Kết quả cuối cùng
    const results = [];

    for (const donHang of donHangResults) {
      // Lấy chi tiết hóa đơn của từng đơn hàng
      const [chiTietHoaDonResults] = await connection.execute(
        `SELECT 
    sp.ID_SAN_PHAM, 
    sp.ID_THUONG_HIEU, 
    sp.ID_DANH_MUC, 
    sp.GIOI_TINH_ID, 
    sp.CHAT_LIEU_ID_,
    sp.TEN_SAN_PHAM, 
    sp.GIA, 
    sp.MO_TA_SAN_PHAM, 
    sp.HINH_ANH_SANPHAM, 
    sp.TRANG_THAI_SANPHAM, 
    sp.NGAY_TAO_SANPHAM, 
    sp.NGAY_CAP_NHAT_SANPHAM, 
    sp.SO_LUONG_SANPHAM,
    gt.TEN_GIOI_TINH,
    dm.TEN_DANH_MUC, 
    dm.MO_TA_LOAI_DANH_MUC,
    cl.TEN_CHAT_LIEU_, 
    cl.MO_TA_CHAT_LIEU,
    th.TEN_THUONG_HIEU,
    pc.ID_PHUONG_CACH, 
    pc.TEN_PHONG_CACH, 
    ms.MAU_SAC_ID, 
    ms.TEN_MAU_SAC, 
    mdsd.ID_MUC_DICH_SU_DUNG, 
    mdsd.TEN_MUC_DICH_SU_DUNG, 
    kc.ID_KICH_CO, 
    kc.KICH_CO, 
    cthd.ID_CHI_TIET_HOA_DON, 
    cthd.SO_LUONG_SP, 
    cthd.GIA_SAN_PHAM_CHI_TIET
FROM 
    SAN_PHAM sp
LEFT JOIN 
    GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN 
    LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN 
    CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN 
    THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
LEFT JOIN 
    PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
LEFT JOIN 
    PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
LEFT JOIN 
    SAN_PHAM_CHI_TIET spct ON sp.ID_SAN_PHAM = spct.ID_SAN_PHAM
LEFT JOIN 
    MAU_SAC ms ON spct.MAU_SAC_ID = ms.MAU_SAC_ID
LEFT JOIN 
    MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
LEFT JOIN 
    MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
LEFT JOIN 
    KICH_CO kc ON spct.ID_KICH_CO = kc.ID_KICH_CO
LEFT JOIN 
    CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM_CHI_TIET = spct.ID_SAN_PHAM_CHI_TIET
WHERE 
    cthd.ID_DON_HANG IN (?)
`,
        [donHang.ID_DON_HANG]
      );
      // Thêm thông tin chi tiết hóa đơn vào từng đơn hàng
      results.push({
        ...donHang,
        chiTietHoaDon: chiTietHoaDonResults,
      });
    }

    // Trả về kết quả
    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

//Đang chờ thanh toán
const getChiTietHoaDonTheoNguoiDung_WaitingThanhToan = async (req, res) => {
  const { id } = req.params; // ID_NGUOI_DUNG được truyền vào
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT
          dh.ID_ODER,
          dh.ID_NGUOI_DUNG,
          dh.ID_THANH_TOAN,
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG,
          dh.GHI_CHU_DONHANG,
          dh.NGAY_CAP_NHAT_DONHANG,
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN,
          nd.EMAIL,
          nd.VAI_TRO,
          nd.HO_TEN,
          nd.SO_DIEN_THOAI,
          nd.DIA_CHI,
          nd.TRANG_THAI_USER,
          nd.NGAY_TAO_USER,
          nd.NGAY_CAP_NHAT_USER,
          nd.AVATAR,
          nd.NGAY_SINH,
          nd.DIA_CHI_Provinces,
          nd.DIA_CHI_Districts,
          nd.DIA_CHI_Wards,
          nd.THEMES,
          nd.LANGUAGE
        FROM
          DON_HANG dh
        LEFT JOIN
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE
          dh.ID_NGUOI_DUNG = ? AND dh.TRANG_THAI_DON_HANG = 'Đang chờ thanh toán'
          ORDER BY
          dh.NGAY_CAP_NHAT_DONHANG DESC`,
      [id]
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const results = [];
    for (const donHang of donHangResults) {
      const [chiTietHoaDonResults] = await connection.execute(
        `SELECT 
    sp.ID_SAN_PHAM, 
    sp.ID_THUONG_HIEU, 
    sp.ID_DANH_MUC, 
    sp.GIOI_TINH_ID, 
    sp.CHAT_LIEU_ID_,
    sp.TEN_SAN_PHAM, 
    sp.GIA, 
    sp.MO_TA_SAN_PHAM, 
    sp.HINH_ANH_SANPHAM, 
    sp.TRANG_THAI_SANPHAM, 
    sp.NGAY_TAO_SANPHAM, 
    sp.NGAY_CAP_NHAT_SANPHAM, 
    sp.SO_LUONG_SANPHAM,
    gt.TEN_GIOI_TINH,
    dm.TEN_DANH_MUC, 
    dm.MO_TA_LOAI_DANH_MUC,
    cl.TEN_CHAT_LIEU_, 
    cl.MO_TA_CHAT_LIEU,
    th.TEN_THUONG_HIEU,
    pc.ID_PHUONG_CACH, 
    pc.TEN_PHONG_CACH, 
    ms.MAU_SAC_ID, 
    ms.TEN_MAU_SAC, 
    mdsd.ID_MUC_DICH_SU_DUNG, 
    mdsd.TEN_MUC_DICH_SU_DUNG, 
    kc.ID_KICH_CO, 
    kc.KICH_CO, 
    cthd.ID_CHI_TIET_HOA_DON, 
    cthd.SO_LUONG_SP, 
    cthd.GIA_SAN_PHAM_CHI_TIET
FROM 
    SAN_PHAM sp
LEFT JOIN 
    GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN 
    LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN 
    CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN 
    THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
LEFT JOIN 
    PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
LEFT JOIN 
    PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
LEFT JOIN 
    SAN_PHAM_CHI_TIET spct ON sp.ID_SAN_PHAM = spct.ID_SAN_PHAM
LEFT JOIN 
    MAU_SAC ms ON spct.MAU_SAC_ID = ms.MAU_SAC_ID
LEFT JOIN 
    MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
LEFT JOIN 
    MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
LEFT JOIN 
    KICH_CO kc ON spct.ID_KICH_CO = kc.ID_KICH_CO
LEFT JOIN 
    CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM_CHI_TIET = spct.ID_SAN_PHAM_CHI_TIET
WHERE 
    cthd.ID_DON_HANG IN (?)

`,
        [donHang.ID_DON_HANG]
      );
      // Ghép kết quả lại với nhau
      // Thêm thông tin chi tiết hóa đơn vào từng đơn hàng
      results.push({
        ...donHang,
        chiTietHoaDon: chiTietHoaDonResults,
      });
    }

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

// Thanh toán thành công và đang chờ xử lý và đang chờ thành toán
const getPaidOrdersAwaitingProcessing = async (req, res) => {
  const { id } = req.params; // ID_NGUOI_DUNG được truyền vào
  try {
    // Lấy tất cả các đơn hàng của người dùng
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
  dh.ID_NGUOI_DUNG = ? AND dh.TRANG_THAI_DON_HANG IN ('Đang chờ thanh toán', 'Đã thanh toán thành công và đang chờ giao hàng')
   ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`,
      [id]
    );

    // Nếu không có đơn hàng nào, trả về thông báo
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }

    // Vòng lặp lấy chi tiết sản phẩm liên quan đến từng đơn hàng
    for (const donHang of donHangResults) {
      console.log("donHang", donHang);
      const [chiTietHoaDonResults] = await connection.execute(
        `SELECT 
    sp.ID_SAN_PHAM, 
    sp.ID_THUONG_HIEU, 
    sp.ID_DANH_MUC, 
    sp.GIOI_TINH_ID, 
    sp.CHAT_LIEU_ID_,
    sp.TEN_SAN_PHAM, 
    sp.GIA, 
    sp.MO_TA_SAN_PHAM, 
    sp.HINH_ANH_SANPHAM, 
    sp.TRANG_THAI_SANPHAM, 
    sp.NGAY_TAO_SANPHAM, 
    sp.NGAY_CAP_NHAT_SANPHAM, 
    sp.SO_LUONG_SANPHAM,
    gt.TEN_GIOI_TINH,
    dm.TEN_DANH_MUC, 
    dm.MO_TA_LOAI_DANH_MUC,
    cl.TEN_CHAT_LIEU_, 
    cl.MO_TA_CHAT_LIEU,
    th.TEN_THUONG_HIEU,
    pc.ID_PHUONG_CACH, 
    pc.TEN_PHONG_CACH, 
    ms.MAU_SAC_ID, 
    ms.TEN_MAU_SAC, 
    mdsd.ID_MUC_DICH_SU_DUNG, 
    mdsd.TEN_MUC_DICH_SU_DUNG, 
    kc.ID_KICH_CO, 
    kc.KICH_CO, 
    cthd.ID_CHI_TIET_HOA_DON, 
    cthd.SO_LUONG_SP, 
    cthd.GIA_SAN_PHAM_CHI_TIET
FROM 
    SAN_PHAM sp
LEFT JOIN 
    GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN 
    LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN 
    CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN 
    THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
LEFT JOIN 
    PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
LEFT JOIN 
    PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
LEFT JOIN 
    SAN_PHAM_CHI_TIET spct ON sp.ID_SAN_PHAM = spct.ID_SAN_PHAM
LEFT JOIN 
    MAU_SAC ms ON spct.MAU_SAC_ID = ms.MAU_SAC_ID
LEFT JOIN 
    MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
LEFT JOIN 
    MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
LEFT JOIN 
    KICH_CO kc ON spct.ID_KICH_CO = kc.ID_KICH_CO
LEFT JOIN 
    CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM_CHI_TIET = spct.ID_SAN_PHAM_CHI_TIET
WHERE 
    cthd.ID_DON_HANG IN (?)
`,
        [donHang.ID_DON_HANG]
      );
      console.log("chiTietHoaDonResults", chiTietHoaDonResults);
      // Gắn chi tiết hóa đơn vào từng đơn hàng
      donHang.chiTietHoaDon = chiTietHoaDonResults;
    }

    // Trả dữ liệu kết quả
    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: donHangResults,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

// Thanh toán thành công và đang chờ xử lý và đang chờ thành toán
const getPaidOrdersDangGiaoHang_ByUser = async (req, res) => {
  const { id } = req.params; // ID_NGUOI_DUNG được truyền vào
  try {
    // Lấy tất cả các đơn hàng của người dùng
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
  dh.ID_NGUOI_DUNG = ? AND dh.TRANG_THAI_DON_HANG = 'Đơn hàng đang giao'
   ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`,
      [id]
    );

    // Nếu không có đơn hàng nào, trả về thông báo
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }

    // Vòng lặp lấy chi tiết sản phẩm liên quan đến từng đơn hàng
    for (const donHang of donHangResults) {
      console.log("donHang", donHang);
      const [chiTietHoaDonResults] = await connection.execute(
        `SELECT 
    sp.ID_SAN_PHAM, 
    sp.ID_THUONG_HIEU, 
    sp.ID_DANH_MUC, 
    sp.GIOI_TINH_ID, 
    sp.CHAT_LIEU_ID_,
    sp.TEN_SAN_PHAM, 
    sp.GIA, 
    sp.MO_TA_SAN_PHAM, 
    sp.HINH_ANH_SANPHAM, 
    sp.TRANG_THAI_SANPHAM, 
    sp.NGAY_TAO_SANPHAM, 
    sp.NGAY_CAP_NHAT_SANPHAM, 
    sp.SO_LUONG_SANPHAM,
    gt.TEN_GIOI_TINH,
    dm.TEN_DANH_MUC, 
    dm.MO_TA_LOAI_DANH_MUC,
    cl.TEN_CHAT_LIEU_, 
    cl.MO_TA_CHAT_LIEU,
    th.TEN_THUONG_HIEU,
    pc.ID_PHUONG_CACH, 
    pc.TEN_PHONG_CACH, 
    ms.MAU_SAC_ID, 
    ms.TEN_MAU_SAC, 
    mdsd.ID_MUC_DICH_SU_DUNG, 
    mdsd.TEN_MUC_DICH_SU_DUNG, 
    kc.ID_KICH_CO, 
    kc.KICH_CO, 
    cthd.ID_CHI_TIET_HOA_DON, 
    cthd.SO_LUONG_SP, 
    cthd.GIA_SAN_PHAM_CHI_TIET
FROM 
    SAN_PHAM sp
LEFT JOIN 
    GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN 
    LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN 
    CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN 
    THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
LEFT JOIN 
    PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
LEFT JOIN 
    PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
LEFT JOIN 
    SAN_PHAM_CHI_TIET spct ON sp.ID_SAN_PHAM = spct.ID_SAN_PHAM
LEFT JOIN 
    MAU_SAC ms ON spct.MAU_SAC_ID = ms.MAU_SAC_ID
LEFT JOIN 
    MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
LEFT JOIN 
    MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
LEFT JOIN 
    KICH_CO kc ON spct.ID_KICH_CO = kc.ID_KICH_CO
LEFT JOIN 
    CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM_CHI_TIET = spct.ID_SAN_PHAM_CHI_TIET
WHERE 
    cthd.ID_DON_HANG IN (?)
`,
        [donHang.ID_DON_HANG]
      );
      console.log("chiTietHoaDonResults", chiTietHoaDonResults);
      // Gắn chi tiết hóa đơn vào từng đơn hàng
      donHang.chiTietHoaDon = chiTietHoaDonResults;
    }

    // Trả dữ liệu kết quả
    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: donHangResults,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

//Đánh giá sản phẩm
const addReviewAndComment = async (req, res) => {
  const { ID_HOA_DON, products } = req.body;
  console.log("re", req.body);
  try {
    // Kiểm tra dữ liệu đầu vào
    if (
      !ID_HOA_DON ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        EM: "Thiếu thông tin đánh giá hoặc bình luận",
        EC: 0,
      });
    }

    // Lặp qua từng sản phẩm và cập nhật đánh giá, bình luận
    for (let product of products) {
      const { id, rating, comments } = product;

      // Cập nhật thông tin đánh giá và bình luận vào bảng CHI_TIET_HOA_DON
      const [updateResult] = await connection.execute(
        `UPDATE CHI_TIET_HOA_DON 
         SET DANH_GIA = ?, BINH_LUAN = ? 
         WHERE ID_CHI_TIET_HOA_DON = ?`,
        [rating, comments, id]
      );

      // Kiểm tra nếu không có bản ghi nào được cập nhật
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({
          EM: `Không tìm thấy chi tiết hóa đơn với ID ${id}`,
          EC: 0,
        });
      }
    }

    // Trả về kết quả thành công
    return res.status(200).json({
      EM: "Cập nhật đánh giá và bình luận thành công",
      EC: 1,
    });
  } catch (error) {
    console.error("Error updating review and comment:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật đánh giá và bình luận",
      EC: 0,
    });
  }
};

// ADMIN ----------------------------------------------------------------------
// lấy tất cả các đơn hàng ra -> ADMIN
const getAllChiTietHoaDon_Admin = async (req, res) => {
  try {
    // Truy vấn bảng DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN, 
          dh.DIA_CHI_DON_HANG,
          dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC
      `
    );

    // Truy vấn bảng CHI_TIET_HOA_DON
    const [chiTietHoaDonResults] = await connection.execute(
      `
      SELECT 
        sp.ID_SAN_PHAM, 
        sp.ID_THUONG_HIEU, 
        sp.ID_DANH_MUC, 
        sp.GIOI_TINH_ID, 
        sp.CHAT_LIEU_ID_,
        sp.TEN_SAN_PHAM, 
        sp.GIA, 
        sp.MO_TA_SAN_PHAM, 
        sp.HINH_ANH_SANPHAM, 
        sp.TRANG_THAI_SANPHAM, 
        sp.NGAY_TAO_SANPHAM, 
        sp.NGAY_CAP_NHAT_SANPHAM, 
        sp.SO_LUONG_SANPHAM,
        gt.TEN_GIOI_TINH,
        dm.TEN_DANH_MUC, 
        dm.MO_TA_LOAI_DANH_MUC,
        cl.TEN_CHAT_LIEU_, 
        cl.MO_TA_CHAT_LIEU,
        th.TEN_THUONG_HIEU,
        pc.ID_PHUONG_CACH, 
        pc.TEN_PHONG_CACH, 
        ms.MAU_SAC_ID, 
        ms.TEN_MAU_SAC, 
        mdsd.ID_MUC_DICH_SU_DUNG, 
        mdsd.TEN_MUC_DICH_SU_DUNG, 
        kc.ID_KICH_CO, 
        kc.KICH_CO, 
        cthd.ID_CHI_TIET_HOA_DON, 
        cthd.SO_LUONG_SP, 
        cthd.GIA_SAN_PHAM_CHI_TIET
      FROM 
        SAN_PHAM sp
      LEFT JOIN 
        GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
      LEFT JOIN 
        LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
      LEFT JOIN 
        CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
      LEFT JOIN 
        THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
      LEFT JOIN 
        PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
      LEFT JOIN 
        PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
      LEFT JOIN 
        MAU_SAC_SAN_PHAM mss ON sp.ID_SAN_PHAM = mss.ID_SAN_PHAM
      LEFT JOIN 
        MAU_SAC ms ON mss.MAU_SAC_ID = ms.MAU_SAC_ID
      LEFT JOIN 
        MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
      LEFT JOIN 
        MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
      LEFT JOIN 
        CO_KICH_CO ckc ON sp.ID_SAN_PHAM = ckc.ID_SAN_PHAM
      LEFT JOIN 
        KICH_CO kc ON ckc.ID_KICH_CO = kc.ID_KICH_CO
      LEFT JOIN 
        CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM = sp.ID_SAN_PHAM;
      `
    );

    // Ghép kết quả lại với nhau
    if (donHangResults.length > 0) {
      const result = donHangResults.map((donHang) => ({
        ...donHang, // Thông tin đơn hàng
        chiTietHoaDon: chiTietHoaDonResults.filter(
          (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
        ), // Lọc chi tiết hóa đơn cho mỗi đơn hàng
      }));

      return res.status(200).json({
        EM: "Lấy chi tiết hóa đơn thành công",
        EC: 1,
        DT: result,
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy đơn hàng nào ",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

// Thanh toán thành công và đang chờ xử lý => ALL  ADMIN
const getALLPaidOrdersAwaitingProcessing_Admin = async (req, res) => {
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
  dh.TRANG_THAI_DON_HANG IN ('Đang chờ thanh toán', 'Đã thanh toán thành công và đang chờ giao hàng')
    ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
    sp.ID_SAN_PHAM, 
    sp.ID_THUONG_HIEU, 
    sp.ID_DANH_MUC, 
    sp.GIOI_TINH_ID,  
    sp.CHAT_LIEU_ID_,
    sp.TEN_SAN_PHAM, 
    sp.GIA, 
    sp.MO_TA_SAN_PHAM, 
    sp.HINH_ANH_SANPHAM, 
    sp.TRANG_THAI_SANPHAM, 
    sp.NGAY_TAO_SANPHAM, 
    sp.NGAY_CAP_NHAT_SANPHAM, 
    sp.SO_LUONG_SANPHAM,
    gt.TEN_GIOI_TINH,
    dm.TEN_DANH_MUC, 
    dm.MO_TA_LOAI_DANH_MUC,
    cl.TEN_CHAT_LIEU_, 
    cl.MO_TA_CHAT_LIEU,
    th.TEN_THUONG_HIEU,
    pc.ID_PHUONG_CACH, 
    pc.TEN_PHONG_CACH, 
    ms.MAU_SAC_ID, 
    ms.TEN_MAU_SAC, 
    mdsd.ID_MUC_DICH_SU_DUNG, 
    mdsd.TEN_MUC_DICH_SU_DUNG, 
    kc.ID_KICH_CO, 
    kc.KICH_CO,
    cthd.ID_CHI_TIET_HOA_DON, 
    cthd.SO_LUONG_SP, 
    cthd.GIA_SAN_PHAM_CHI_TIET,
    cthd.ID_DON_HANG,
    spct.ID_SAN_PHAM_CHI_TIET
FROM 
    SAN_PHAM sp
LEFT JOIN 
    GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN 
    LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN 
    CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN 
    THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
LEFT JOIN 
    PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
LEFT JOIN 
    PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
LEFT JOIN 
    SAN_PHAM_CHI_TIET spct ON sp.ID_SAN_PHAM = spct.ID_SAN_PHAM
LEFT JOIN 
    MAU_SAC ms ON spct.MAU_SAC_ID = ms.MAU_SAC_ID
LEFT JOIN 
    KICH_CO kc ON spct.ID_KICH_CO = kc.ID_KICH_CO
LEFT JOIN 
    MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
LEFT JOIN 
    MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
LEFT JOIN 
    CHI_TIET_HOA_DON cthd ON spct.ID_SAN_PHAM_CHI_TIET = cthd.ID_SAN_PHAM_CHI_TIET
WHERE 
    cthd.ID_DON_HANG IN (?);
`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

const getALLPaidOrders_DangGiaoHang_Admin = async (req, res) => {
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
  dh.TRANG_THAI_DON_HANG = 'Đơn hàng đang giao'
    ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
    sp.ID_SAN_PHAM, 
    sp.ID_THUONG_HIEU, 
    sp.ID_DANH_MUC, 
    sp.GIOI_TINH_ID,  
    sp.CHAT_LIEU_ID_,
    sp.TEN_SAN_PHAM, 
    sp.GIA, 
    sp.MO_TA_SAN_PHAM, 
    sp.HINH_ANH_SANPHAM, 
    sp.TRANG_THAI_SANPHAM, 
    sp.NGAY_TAO_SANPHAM, 
    sp.NGAY_CAP_NHAT_SANPHAM, 
    sp.SO_LUONG_SANPHAM,
    gt.TEN_GIOI_TINH,
    dm.TEN_DANH_MUC, 
    dm.MO_TA_LOAI_DANH_MUC,
    cl.TEN_CHAT_LIEU_, 
    cl.MO_TA_CHAT_LIEU,
    th.TEN_THUONG_HIEU,
    pc.ID_PHUONG_CACH, 
    pc.TEN_PHONG_CACH, 
    ms.MAU_SAC_ID, 
    ms.TEN_MAU_SAC, 
    mdsd.ID_MUC_DICH_SU_DUNG, 
    mdsd.TEN_MUC_DICH_SU_DUNG, 
    kc.ID_KICH_CO, 
    kc.KICH_CO,
    cthd.ID_CHI_TIET_HOA_DON, 
    cthd.SO_LUONG_SP, 
    cthd.GIA_SAN_PHAM_CHI_TIET,
    cthd.ID_DON_HANG,
    spct.ID_SAN_PHAM_CHI_TIET
FROM 
    SAN_PHAM sp
LEFT JOIN 
    GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN 
    LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN 
    CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN 
    THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
LEFT JOIN 
    PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
LEFT JOIN 
    PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
LEFT JOIN 
    SAN_PHAM_CHI_TIET spct ON sp.ID_SAN_PHAM = spct.ID_SAN_PHAM
LEFT JOIN 
    MAU_SAC ms ON spct.MAU_SAC_ID = ms.MAU_SAC_ID
LEFT JOIN 
    KICH_CO kc ON spct.ID_KICH_CO = kc.ID_KICH_CO
LEFT JOIN 
    MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
LEFT JOIN 
    MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
LEFT JOIN 
    CHI_TIET_HOA_DON cthd ON spct.ID_SAN_PHAM_CHI_TIET = cthd.ID_SAN_PHAM_CHI_TIET
WHERE 
    cthd.ID_DON_HANG IN (?);
`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

//Đã hủy  => ALL  ADMIN
const getALLChiTietHoaDonTheoNguoiDung_Cancel_Admin = async (req, res) => {
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,   dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG,
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
          dh.TRANG_THAI_DON_HANG = 'Đã hủy'
           ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
    sp.ID_SAN_PHAM, 
    sp.ID_THUONG_HIEU, 
    sp.ID_DANH_MUC, 
    sp.GIOI_TINH_ID,  
    sp.CHAT_LIEU_ID_,
    sp.TEN_SAN_PHAM, 
    sp.GIA, 
    sp.MO_TA_SAN_PHAM, 
    sp.HINH_ANH_SANPHAM, 
    sp.TRANG_THAI_SANPHAM, 
    sp.NGAY_TAO_SANPHAM, 
    sp.NGAY_CAP_NHAT_SANPHAM, 
    sp.SO_LUONG_SANPHAM,
    gt.TEN_GIOI_TINH,
    dm.TEN_DANH_MUC, 
    dm.MO_TA_LOAI_DANH_MUC,
    cl.TEN_CHAT_LIEU_, 
    cl.MO_TA_CHAT_LIEU,
    th.TEN_THUONG_HIEU,
    pc.ID_PHUONG_CACH, 
    pc.TEN_PHONG_CACH, 
    ms.MAU_SAC_ID, 
    ms.TEN_MAU_SAC, 
    mdsd.ID_MUC_DICH_SU_DUNG, 
    mdsd.TEN_MUC_DICH_SU_DUNG, 
    kc.ID_KICH_CO, 
    kc.KICH_CO,
    cthd.ID_CHI_TIET_HOA_DON, 
    cthd.SO_LUONG_SP, 
    cthd.GIA_SAN_PHAM_CHI_TIET,
    cthd.ID_DON_HANG,
    spct.ID_SAN_PHAM_CHI_TIET
FROM 
    SAN_PHAM sp
LEFT JOIN 
    GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN 
    LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN 
    CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN 
    THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
LEFT JOIN 
    PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
LEFT JOIN 
    PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
LEFT JOIN 
    SAN_PHAM_CHI_TIET spct ON sp.ID_SAN_PHAM = spct.ID_SAN_PHAM
LEFT JOIN 
    MAU_SAC ms ON spct.MAU_SAC_ID = ms.MAU_SAC_ID
LEFT JOIN 
    KICH_CO kc ON spct.ID_KICH_CO = kc.ID_KICH_CO
LEFT JOIN 
    MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
LEFT JOIN 
    MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
LEFT JOIN 
    CHI_TIET_HOA_DON cthd ON spct.ID_SAN_PHAM_CHI_TIET = cthd.ID_SAN_PHAM_CHI_TIET
WHERE 
    cthd.ID_DON_HANG IN (?);
`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

// Giao dịch thành công => ALL ADMIN
const getAllChiTietHoaDonTheoNguoiDung_Success_Admin = async (req, res) => {
  try {
    // Truy vấn bảng DON_HANG với điều kiện TRANG_THAI_DON_HANG
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN,  dh.DIA_CHI_DON_HANG,
        dh.SO_DIEN_THOAI_DON_HANG, 
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
          dh.TRANG_THAI_DON_HANG = 'Giao dịch thành công' 
           ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`
    );
    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng cho người dùng này",
        EC: 1,
        DT: [],
      });
    }
    // Lấy danh sách ID_DON_HANG để dùng trong truy vấn chi tiết hóa đơn
    const donHangIds = donHangResults.map((dh) => dh.ID_DON_HANG);
    // Truy vấn bảng CHI_TIET_HOA_DON với danh sách ID_DON_HANG
    const [chiTietHoaDonResults] = await connection.execute(
      `SELECT 
    sp.ID_SAN_PHAM, 
    sp.ID_THUONG_HIEU, 
    sp.ID_DANH_MUC, 
    sp.GIOI_TINH_ID,  
    sp.CHAT_LIEU_ID_,
    sp.TEN_SAN_PHAM, 
    sp.GIA, 
    sp.MO_TA_SAN_PHAM, 
    sp.HINH_ANH_SANPHAM, 
    sp.TRANG_THAI_SANPHAM, 
    sp.NGAY_TAO_SANPHAM, 
    sp.NGAY_CAP_NHAT_SANPHAM, 
    sp.SO_LUONG_SANPHAM,
    gt.TEN_GIOI_TINH,
    dm.TEN_DANH_MUC, 
    dm.MO_TA_LOAI_DANH_MUC,
    cl.TEN_CHAT_LIEU_, 
    cl.MO_TA_CHAT_LIEU,
    th.TEN_THUONG_HIEU,
    pc.ID_PHUONG_CACH, 
    pc.TEN_PHONG_CACH, 
    ms.MAU_SAC_ID, 
    ms.TEN_MAU_SAC, 
    mdsd.ID_MUC_DICH_SU_DUNG, 
    mdsd.TEN_MUC_DICH_SU_DUNG, 
    kc.ID_KICH_CO, 
    kc.KICH_CO,
    cthd.ID_CHI_TIET_HOA_DON, 
    cthd.SO_LUONG_SP, 
    cthd.GIA_SAN_PHAM_CHI_TIET,
    cthd.ID_DON_HANG,
    spct.ID_SAN_PHAM_CHI_TIET
FROM 
    SAN_PHAM sp
LEFT JOIN 
    GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
LEFT JOIN 
    LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
LEFT JOIN 
    CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
LEFT JOIN 
    THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
LEFT JOIN 
    PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
LEFT JOIN 
    PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
LEFT JOIN 
    SAN_PHAM_CHI_TIET spct ON sp.ID_SAN_PHAM = spct.ID_SAN_PHAM
LEFT JOIN 
    MAU_SAC ms ON spct.MAU_SAC_ID = ms.MAU_SAC_ID
LEFT JOIN 
    KICH_CO kc ON spct.ID_KICH_CO = kc.ID_KICH_CO
LEFT JOIN 
    MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
LEFT JOIN 
    MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
LEFT JOIN 
    CHI_TIET_HOA_DON cthd ON spct.ID_SAN_PHAM_CHI_TIET = cthd.ID_SAN_PHAM_CHI_TIET
WHERE 
    cthd.ID_DON_HANG IN (?);
`,
      [donHangIds[0]]
    );
    // Ghép kết quả lại với nhau
    const result = donHangResults.map((donHang) => ({
      ...donHang,
      chiTietHoaDon: chiTietHoaDonResults.filter(
        (cthd) => cthd.ID_DON_HANG === donHang.ID_DON_HANG
      ),
    }));

    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn thành công",
      EC: 1,
      DT: result,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn",
      EC: 0,
      DT: [],
    });
  }
};

//Xuất excel
const getChiTietHoaDonTheoThoiGian = async (req, res) => {
  const { status, startDate, endDate } = req.body; // Lấy dữ liệu từ body
  try {
    // Truy vấn bảng DON_HANG với điều kiện trạng thái và thời gian bắt đầu, kết thúc
    const [donHangResults] = await connection.execute(
      `SELECT 
          dh.ID_ODER, 
          dh.ID_NGUOI_DUNG, 
          dh.ID_THANH_TOAN, 
          dh.ID_DON_HANG,
          dh.TONG_TIEN, dh.DIA_CHI_DON_HANG,
          dh.SO_DIEN_THOAI_DON_HANG, 
          dh.TRANG_THAI_DON_HANG, 
          dh.GHI_CHU_DONHANG, 
          dh.NGAY_CAP_NHAT_DONHANG, 
          dh.NGAY_TAO_DONHANG,
          tt.PHUONG_THUC_THANH_TOAN, 
          nd.EMAIL, 
          nd.VAI_TRO, 
          nd.HO_TEN, 
          nd.SO_DIEN_THOAI, 
          nd.DIA_CHI, 
          nd.TRANG_THAI_USER, 
          nd.NGAY_TAO_USER, 
          nd.NGAY_CAP_NHAT_USER, 
          nd.AVATAR, 
          nd.NGAY_SINH, 
          nd.DIA_CHI_Provinces, 
          nd.DIA_CHI_Districts, 
          nd.DIA_CHI_Wards, 
          nd.THEMES, 
          nd.LANGUAGE
        FROM 
          DON_HANG dh
        LEFT JOIN 
          THANH_TOAN tt ON dh.ID_THANH_TOAN = tt.ID_THANH_TOAN
        LEFT JOIN 
          NGUOI_DUNG nd ON dh.ID_NGUOI_DUNG = nd.ID_NGUOI_DUNG
        WHERE 
         
          dh.TRANG_THAI_DON_HANG = ? AND 
          dh.NGAY_TAO_DONHANG BETWEEN ? AND ?
        ORDER BY 
          dh.NGAY_CAP_NHAT_DONHANG DESC`,
      [status, startDate, endDate]
    );

    // Nếu không có đơn hàng nào, trả về thông báo lỗi
    if (donHangResults.length === 0) {
      return res.status(200).json({
        EM: "Không tìm thấy đơn hàng theo yêu cầu",
        EC: 1,
        DT: [],
      });
    }

    // Kết quả cuối cùng
    const results = [];

    for (const donHang of donHangResults) {
      // Lấy chi tiết hóa đơn của từng đơn hàng
      const [chiTietHoaDonResults] = await connection.execute(
        `SELECT 
          sp.ID_SAN_PHAM, 
          sp.ID_THUONG_HIEU, 
          sp.ID_DANH_MUC, 
          sp.GIOI_TINH_ID, 
          sp.CHAT_LIEU_ID_,
          sp.TEN_SAN_PHAM, 
          sp.GIA, 
          sp.MO_TA_SAN_PHAM, 
          sp.HINH_ANH_SANPHAM, 
          sp.TRANG_THAI_SANPHAM, 
          sp.NGAY_TAO_SANPHAM, 
          sp.NGAY_CAP_NHAT_SANPHAM, 
          sp.SO_LUONG_SANPHAM,
          gt.TEN_GIOI_TINH,
          dm.TEN_DANH_MUC, 
          dm.MO_TA_LOAI_DANH_MUC,
          cl.TEN_CHAT_LIEU_, 
          cl.MO_TA_CHAT_LIEU,
          th.TEN_THUONG_HIEU,
          pc.ID_PHUONG_CACH, 
          pc.TEN_PHONG_CACH, 
          ms.MAU_SAC_ID, 
          ms.TEN_MAU_SAC, 
          mdsd.ID_MUC_DICH_SU_DUNG, 
          mdsd.TEN_MUC_DICH_SU_DUNG, 
          kc.ID_KICH_CO, 
          kc.KICH_CO, 
          cthd.ID_CHI_TIET_HOA_DON, 
          cthd.SO_LUONG_SP, 
          cthd.DANH_GIA,
          cthd.GIA_SAN_PHAM_CHI_TIET
        FROM 
          SAN_PHAM sp
        LEFT JOIN 
          GIOI_TINH gt ON sp.GIOI_TINH_ID = gt.GIOI_TINH_ID
        LEFT JOIN 
          LOAI_DANH_MUC dm ON sp.ID_DANH_MUC = dm.ID_DANH_MUC
        LEFT JOIN 
          CHAT_LIEU cl ON sp.CHAT_LIEU_ID_ = cl.CHAT_LIEU_ID_
        LEFT JOIN 
          THUONG_HIEU th ON sp.ID_THUONG_HIEU = th.ID_THUONG_HIEU
        LEFT JOIN 
          PHONG_CACH_SAN_PHAM pcs ON sp.ID_SAN_PHAM = pcs.ID_SAN_PHAM
        LEFT JOIN 
          PHONG_CACH pc ON pcs.ID_PHUONG_CACH = pc.ID_PHUONG_CACH
        LEFT JOIN 
          SAN_PHAM_CHI_TIET spct ON sp.ID_SAN_PHAM = spct.ID_SAN_PHAM
        LEFT JOIN 
          MAU_SAC ms ON spct.MAU_SAC_ID = ms.MAU_SAC_ID
        LEFT JOIN 
          MUC_DICH_SU_DUNG_SAN_PHAM mdsds ON sp.ID_SAN_PHAM = mdsds.ID_SAN_PHAM
        LEFT JOIN 
          MUC_DICH_SU_DUNG mdsd ON mdsds.ID_MUC_DICH_SU_DUNG = mdsd.ID_MUC_DICH_SU_DUNG
        LEFT JOIN 
          KICH_CO kc ON spct.ID_KICH_CO = kc.ID_KICH_CO
        LEFT JOIN 
          CHI_TIET_HOA_DON cthd ON cthd.ID_SAN_PHAM_CHI_TIET = spct.ID_SAN_PHAM_CHI_TIET
        WHERE 
          cthd.ID_DON_HANG IN (?) 
        `,
        [donHang.ID_DON_HANG]
      );

      // Ghép kết quả lại với nhau
      results.push({
        ...donHang,
        chiTietHoaDon: chiTietHoaDonResults,
      });
    }

    // Trả về kết quả
    return res.status(200).json({
      EM: "Lấy chi tiết hóa đơn theo thời gian thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error fetching chi tiet hoa don theo thoi gian:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy chi tiết hóa đơn theo thời gian",
      EC: 0,
      DT: [],
    });
  }
};

module.exports = {
  getChiTietHoaDon,
  getChiTietHoaDonTheoNguoiDung_Success,
  getChiTietHoaDonTheoNguoiDung_Cancel,
  getPaidOrdersAwaitingProcessing,
  getChiTietHoaDonTheoNguoiDung_WaitingThanhToan,
  getPaidOrdersDangGiaoHang_ByUser,
  addReviewAndComment,
  //
  getAllChiTietHoaDon_Admin,
  getALLPaidOrdersAwaitingProcessing_Admin,
  getALLChiTietHoaDonTheoNguoiDung_Cancel_Admin,
  getAllChiTietHoaDonTheoNguoiDung_Success_Admin,
  getALLPaidOrders_DangGiaoHang_Admin,
  getChiTietHoaDonTheoThoiGian,
};
