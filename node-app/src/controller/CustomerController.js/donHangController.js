const connection = require("../../config/database");
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpStorage = new Map();

// Lấy danh sách đơn hàng oke rồi
const getDON_HANG = async (req, res) => {
  try {
    // Lấy dữ liệu đơn hàng kèm thông tin thanh toán, sản phẩm và người dùng
    const [results] = await connection.execute(`
     SELECT 
    -- Dữ liệu từ bảng Hóa Đơn
    h.MAHD, 
    h.MA_THANH_TOAN, 
    h.MA_KH, 
    h.DIA_CHI_SHIP, 
    h.SDT_LIEN_HE_KH, 
    h.NGAY_LAP_HOA_DON, 
    h.GHI_CHU_HOA_DON, 
    h.TONG_TIEN,
    
    -- Dữ liệu từ bảng Thanh Toán
    t.CACH_THANH_TOAN, 
    t.GHI_CHU_THANH_TOAN,
    
    -- Dữ liệu từ bảng Khách Hàng
    k.TEN_KHACH_HANG, 
    k.DIA_CHI, 
    k.SDT_KH, 
    k.GHI_CHU_KH, 
    k.DIA_CHI_Provinces, 
    k.DIA_CHI_Wards, 
    k.DIA_CHI_STREETNAME, 
    k.DIA_CHI_Districts, 
    k.NGAY_SINH, 
    k.AVATAR, 
    k.GHI_CHU_KH,
    
    -- Dữ liệu từ bảng Chi Tiết Hóa Đơn
    c.MA_CTHD, 
    c.MASP, 
    c.SO_LUONG, 
    c.GIA_SP_KHI_MUA, 
    c.GIAM_GIA_KHI_MUA, 
    c.GHI_CHU_CTHD, 
    c.BINH_LUAN, 
    c.DANH_GIA,
    
    -- Dữ liệu từ bảng Sản Phẩm
    p.TENSP, 
    p.DON_GIA, 
    p.NHA_SAN_XUAT, 
    p.ANH_SP, 
    p.GHI_CHU_SP, 
    p.TRANG_THAI_SAN_PHAM,
    
    -- Dữ liệu từ bảng Thể Loại
    tl.TENTL, 
    tl.MO_TA_TL, 
    tl.GHI_CHU_TL

FROM 
    hoadon h
LEFT JOIN 
    thanh_toan t ON h.MA_THANH_TOAN = t.MA_THANH_TOAN
LEFT JOIN 
    khachhang k ON h.MA_KH = k.MA_KH
LEFT JOIN 
    chi_tiet_hoa_don c ON h.MAHD = c.MAHD
LEFT JOIN 
    sanpham p ON c.MASP = p.MASP
LEFT JOIN 
    thuoc_loai tl1 ON p.MASP = tl1.MASP
LEFT JOIN 
    theloai tl ON tl1.MATL = tl.MATL
ORDER BY 
    h.NGAY_LAP_HOA_DON DESC;

    `);

    return res.status(200).json({
      EM: "Lấy danh sách đơn hàng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting don hang:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};

// chưa xài
const getDON_HANG_ByIDUser = async (req, res) => {
  try {
    // Lấy MA_KH từ tham số của request
    const { id } = req.params;

    // Lấy dữ liệu đơn hàng kèm thông tin thanh toán và người dùng
    const [results] = await connection.execute(
      `
     SELECT 
    -- Dữ liệu từ bảng Hóa Đơn
    h.MAHD, 
    h.MA_THANH_TOAN, 
    h.MA_KH, 
    h.DIA_CHI_SHIP, 
    h.SDT_LIEN_HE_KH, 
    h.NGAY_LAP_HOA_DON, 
    h.GHI_CHU_HOA_DON, 
    h.TONG_TIEN,
    
    -- Dữ liệu từ bảng Thanh Toán
    t.CACH_THANH_TOAN, 
    t.GHI_CHU_THANH_TOAN,
    
    -- Dữ liệu từ bảng Khách Hàng
    k.TEN_KHACH_HANG, 
    k.DIA_CHI, 
    k.SDT_KH, 
    k.GHI_CHU_KH, 
    k.DIA_CHI_Provinces, 
    k.DIA_CHI_Wards, 
    k.DIA_CHI_STREETNAME, 
    k.DIA_CHI_Districts, 
    k.NGAY_SINH, 
    k.AVATAR, 
    k.GHI_CHU_KH,
    
    -- Dữ liệu từ bảng Chi Tiết Hóa Đơn
    c.MA_CTHD, 
    c.MASP, 
    c.SO_LUONG, 
    c.GIA_SP_KHI_MUA, 
    c.GIAM_GIA_KHI_MUA, 
    c.GHI_CHU_CTHD, 
    c.BINH_LUAN, 
    c.DANH_GIA,
    
    -- Dữ liệu từ bảng Sản Phẩm
    p.TENSP, 
    p.DON_GIA, 
    p.NHA_SAN_XUAT, 
    p.ANH_SP, 
    p.GHI_CHU_SP, 
    p.TRANG_THAI_SAN_PHAM,
    
    -- Dữ liệu từ bảng Thể Loại
    tl.TENTL, 
    tl.MO_TA_TL, 
    tl.GHI_CHU_TL

FROM 
    hoadon h
LEFT JOIN 
    thanh_toan t ON h.MA_THANH_TOAN = t.MA_THANH_TOAN
LEFT JOIN 
    khachhang k ON h.MA_KH = k.MA_KH
LEFT JOIN 
    chi_tiet_hoa_don c ON h.MAHD = c.MAHD
LEFT JOIN 
    sanpham p ON c.MASP = p.MASP
LEFT JOIN 
    thuoc_loai tl1 ON p.MASP = tl1.MASP
LEFT JOIN 
    theloai tl ON tl1.MATL = tl.MATL
    where k.MA_KH = ?
ORDER BY 
    h.NGAY_LAP_HOA_DON DESC;
    
    `,
      [id]
    ); // Truyền tham số idNguoiDung vào câu truy vấn

    return res.status(200).json({
      EM: "Lấy danh sách đơn hàng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting don hang:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};

// đang sử dụng
const createDON_HANG = async (req, res) => {
  // console.log("Tạo đơn: ", req.body);

  const {
    ID_USER,
    idThanhToan,
    PRICE_PRODUCTDETAILS,
    trangThaiDonHang = "Đang chờ thanh toán",
    ID_ODER,
    items,
    ADDRESS,
    PHONENUMBER
  } = req.body;

  try {
    const itemsArray = Array.isArray(items) ? items : [items];
    const ngayTaoDonHang = new Date();

    // Tính tổng tiền
    const tongTien = itemsArray.reduce((sum, item) => {
      return sum + (item.PRICE_PRODUCTDETAILS * (item.SO_LUONG || 1));
    }, 0);

    // Thêm vào bảng orders
    const [orderResult] = await connection.execute(
      `INSERT INTO orders 
       (ID_USER, QUANTITY, STATUS, PAYMENTSTATUS, PAYMENTMETHOD, TOTALORDERPRICE, CREATEAT, ISDELETE) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        ID_USER,
        itemsArray.length,
        trangThaiDonHang,
        "Chưa thanh toán",
        "Chuyển khoản",
        tongTien,
        ngayTaoDonHang
      ]
    );

    const orderId = orderResult.insertId;

    // Thêm chi tiết từng sản phẩm
    for (const item of itemsArray) {
      const soLuong = item.SO_LUONG || 1;
      const unitPrice = item.PRICE_PRODUCTDETAILS;
      const totalPrice = unitPrice * soLuong;

      await connection.execute(
        `INSERT INTO order_item 
         (ID_PRODUCTDETAILS, ID_ORDER, QUANTITY, UNIT_PRICE, TOTAL_PRICE, CREATEAT, ISDELETE) 
         VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [
          item.ID_PRODUCTDETAILS,
          orderId,
          soLuong,
          unitPrice,
          totalPrice,
          ngayTaoDonHang
        ]
      );
    }

    // Lấy order_item mới tạo
    const [orderDetails] = await connection.execute(
      `SELECT oi.*, p.NAMEPRODUCT
       FROM order_item oi
       JOIN product_details pd ON oi.ID_PRODUCTDETAILS = pd.ID_PRODUCTDETAILS
       JOIN product p ON pd.ID_PRODUCT = p.ID_PRODUCT
       WHERE oi.ID_ORDER = ?`,
      [orderId]
    );

    // Lấy thông tin người dùng
    const [userResults] = await connection.execute(
      `SELECT LASTNAME, EMAIL
       FROM user
       WHERE ID_USER = ?`,
      [ID_USER]
    );

    if (userResults.length === 0) {
      return res.status(404).json({
        EM: "Người dùng không tồn tại",
        EC: -1,
      });
    }

    const user = userResults[0];

    // Chuẩn bị thông tin gửi email
    const orderDetailsFormatted = {
      orderId: orderId,
      tongTien: tongTien,
      ngayTaoDonHang: ngayTaoDonHang,
      items: orderDetails.map((item) => ({
        tenSanPham: item.NAMEPRODUCT,
        soLuong: item.QUANTITY,
        giaSanPhamChiTiet: item.UNIT_PRICE,
        giamGia: item.GIAM_GIA_KHI_MUA || 0
      })),
      user: {
        name: user.LASTNAME,
        email: user.EMAIL,
        address: ADDRESS,
        phone: PHONENUMBER,
      },
    };

    // Gọi hàm gửi email
    // const emailResult = await sendOrderEmail({
    //   email: user.EMAIL,
    //   orderDetails: orderDetailsFormatted,
    // });
    let emailResult = {
      EC: 1, // 1 = thành công, 0 = thất bại (theo quy ước của bạn)
      EM: "Email sent successfully (fake mode)", // Thông báo giả
      DT: null // Data trả về (nếu cần)
    };
    if (emailResult.EC === 1) {
      //Xóa giỏ hàng thêm sau
      return res.status(200).json({
        EM: "Mua hàng thành công, vui lòng kiểm tra đơn hàng",
        EC: 1,
      });
    } else {
      return res.status(500).json({
        EM: "Đơn hàng tạo thành công nhưng gửi email thất bại",
        EC: -1,
      });
    }
  } catch (error) {
    console.error("Error creating don hang:", error);
    return res.status(500).json({
      EM: "Lỗi khi thêm đơn hàng hoặc gửi email",
      EC: -1,
    });
  }
};

const updateTrangThaiDonHang = async (req, res) => {
  const { ID_ODER, email, idNguoiDung } = req.body;

  if (!ID_ODER || !email || !idNguoiDung) {
    return res.status(400).json({
      EM: "Vui lòng cung cấp đầy đủ thông tin",
      EC: -1,
    });
  }

  try {
    // Lấy thông tin đơn hàng và chi tiết sản phẩm
    const [orderResults] = await connection.execute(
      "SELECT * FROM hoadon WHERE ID_ODER = ? AND MA_KH = ?",
      [ID_ODER, idNguoiDung]
    );

    if (orderResults.length === 0) {
      return res.status(404).json({
        EM: "Đơn hàng không tồn tại",
        EC: -1,
      });
    }

    const order = orderResults[0]; // Lấy đơn hàng đầu tiên (vì ID_ODER là duy nhất)
    const trangThaiDonHang = "Giao dịch thành công";
    const [updateResults] = await connection.execute(
      "UPDATE hoadon SET GHI_CHU_HOA_DON = ?, NGAY_LAP_HOA_DON = ? WHERE ID_ODER = ?",
      [trangThaiDonHang, new Date(), ID_ODER]
    );

    const [orderDetails] = await connection.execute(
      "SELECT c.MASP, c.SO_LUONG, c.GIA_SP_KHI_MUA, c.GIAM_GIA_KHI_MUA, p.TENSP FROM chi_tiet_hoa_don c JOIN sanpham p ON c.MASP = p.MASP WHERE c.MAHD = ?",
      [order.MAHD]
    );

    // Lấy thông tin người dùng
    const [userResults] = await connection.execute(
      "SELECT TEN_KHACH_HANG, TEN_DANG_NHAP, DIA_CHI_Provinces, DIA_CHI_Districts, DIA_CHI_Wards, SDT_KH,DIA_CHI_STREETNAME,DIA_CHI  FROM khachhang WHERE MA_KH = ?",
      [idNguoiDung]
    );
    console.log("orderDetails", orderDetails);
    if (userResults.length === 0) {
      return res.status(404).json({
        EM: "Người dùng không tồn tại",
        EC: -1,
      });
    }

    const user = userResults[0]; // Lấy thông tin người dùng

    // Chuẩn bị thông tin gửi email
    const orderDetailsFormatted = {
      orderId: order.ID_ODER,
      tongTien: order.TONG_TIEN,
      ngayTaoDonHang: order.NGAY_TAO_DONHANG,
      items: orderDetails.map((item) => ({
        tenSanPham: item.TENSP,

        giaSanPhamChiTiet: item.GIA_SP_KHI_MUA,
      })),
      user: {
        name: user.TEN_KHACH_HANG,
        email: user.TEN_DANG_NHAP,
        address: order.DIA_CHI_SHIP,

        phone: order.SDT_LIEN_HE_KH,
      },
    };

    // Gọi hàm gửi email
    const emailResult = await sendOrderEmail({
      email,
      orderDetails: orderDetailsFormatted,
    });

    if (emailResult.EC === 1) {
      // Xóa dữ liệu trong bảng GIO_HANG nếu email gửi thành công
      await connection.execute("DELETE FROM gio_hang WHERE MA_KH = ?", [
        idNguoiDung,
      ]);

      return res.json({
        EM: "Cập nhật trạng thái đơn hàng thành công và đã gửi email",
        EC: 1,
      });
    } else {
      return res.status(500).json({
        EM: "Lỗi khi gửi email",
        EC: -1,
      });
    }
  } catch (error) {
    console.error("Error updating don hang status:", error);
    return res.status(500).json({
      EM: "Lỗi khi cập nhật trạng thái đơn hàng",
      EC: -1,
    });
  }
};

// Hàm gửi email
const sendOrderEmail = async ({ email, orderDetails }) => {
  if (!email || !orderDetails) {
    return { EM: "Email và chi tiết đơn hàng là bắt buộc", EC: -1 };
  }

  const formattedTongTien = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(orderDetails.tongTien);

  const formattedNgayDat = new Date(orderDetails.ngayTaoDonHang).toLocaleString("vi-VN");

  // Nội dung email
  const orderMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center; padding-bottom: 10px;">
        <h1 style="color: #007BFF;">Cảm Ơn Bạn Đã Đặt Hàng! Shop Điện Tử</h1>
        <p style="font-size: 16px; color: #555;">Đơn hàng của bạn đã được ghi nhận thành công.</p>
      </div>

      <div style="padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #007BFF;">Chi Tiết Đơn Hàng</h2>
        <p><strong>Mã Đơn Hàng:</strong> ${orderDetails.orderId}</p>
        <p><strong>Tổng Tiền:</strong> ${formattedTongTien}</p>
        <p><strong>Ngày Đặt:</strong> ${formattedNgayDat}</p>

        <h3>Sản Phẩm:</h3>
        <ul>
          ${orderDetails.items.map(item => `
            <li>
              ${item.tenSanPham} - 
              SL: ${item.soLuong} - 
              Giá: ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.giaSanPhamChiTiet)}
            </li>
          `).join("")}
        </ul>

        <h3>Thông Tin Người Dùng:</h3>
        <p><strong>Họ Tên:</strong> ${orderDetails.user.name}</p>
        <p><strong>Địa Chỉ:</strong> ${orderDetails.user.address}</p>
        <p><strong>Số Điện Thoại:</strong> ${orderDetails.user.phone}</p>
      </div>

      <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Shop Điện Tử. All rights reserved.</p>
      </div>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "baoquoczero@gmail.com",
      pass: "atnb rkps serx fozp"
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_OTP, // Không hardcode email
    to: email,
    subject: "Thông Tin Đơn Hàng Của Bạn",
    html: orderMessage,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { EM: "Gửi email đơn hàng thành công", EC: 1 };
  } catch (error) {
    console.error("Error sending order email:", error);
    return { EM: "Gửi email thất bại", EC: -1 };
  }
};

// Cập nhật đơn hàng
const updateDON_HANG = async (req, res) => {
  const { id } = req.params;
  const {
    idNguoiDung,
    idThanhToan,
    tongTien,
    trangThaiDonHang,
    ghiChuDonHang,
  } = req.body;
  try {
    const [results] = await connection.execute(
      "SELECT * FROM don_hang WHERE ID_DON_HANG = ?",
      [id]
    );

    if (results.length > 0) {
      const ngayCapNhatDonHang = new Date(); // Lấy ngày hiện tại
      await connection.execute(
        "UPDATE don_hang SET MA_KH = ?, ID_THANH_TOAN = ?, TONG_TIEN = ?, TRANG_THAI_DON_HANG = ?, GHI_CHU_DONHANG = ?, NGAY_CAP_NHAT_DONHANG = ? WHERE ID_DON_HANG = ?",
        [
          idNguoiDung,
          idThanhToan,
          tongTien,
          trangThaiDonHang,
          ghiChuDonHang,
          ngayCapNhatDonHang,
          id,
        ]
      );
      return {
        EM: "Cập nhật đơn hàng thành công",
        EC: 1,
        DT: [],
      };
    } else {
      return {
        EM: "Không tìm thấy đơn hàng",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.error("Error updating don hang:", error);
    return {
      EM: "Có lỗi xảy ra khi cập nhật đơn hàng",
      EC: 0,
      DT: [],
    };
  }
};

// Xóa đơn hàng
const deleteDON_HANG = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await connection.execute(
      "SELECT * FROM don_hang WHERE ID_DON_HANG = ?",
      [id]
    );

    if (results.length > 0) {
      await connection.execute("DELETE FROM DON_HANG WHERE ID_DON_HANG = ?", [
        id,
      ]);
      return {
        EM: "Xóa đơn hàng thành công",
        EC: 1,
        DT: [],
      };
    } else {
      return {
        EM: "Không tìm thấy đơn hàng để xóa",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.error("Error deleting don hang:", error);
    return {
      EM: "Có lỗi xảy ra khi xóa đơn hàng",
      EC: 0,
      DT: [],
    };
  }
};

// Cập nhật trạng thái đơn hàng là "Đã hủy" cho USER
const updateOrderStatusCanceled_User = async (req, res) => {
  const { orderId } = req.params; // ID đơn hàng từ tham số URL
  const { userId } = req.user; // ID người dùng từ thông tin xác thực (JWT)

  try {
    // Kiểm tra xem người dùng có quyền cập nhật đơn hàng này không
    const [orderCheck] = await connection.execute(
      `SELECT * FROM DON_HANG WHERE ID_ODER = ? AND MA_KH = ?`,
      [orderId, userId] // Xác nhận người dùng có quyền truy cập đơn hàng này
    );

    if (orderCheck.length === 0) {
      return res.status(403).json({
        EM: "Bạn không có quyền cập nhật trạng thái đơn hàng này",
        EC: 0,
        DT: [],
      });
    }

    // Cập nhật trạng thái đơn hàng
    const [result] = await connection.execute(
      `UPDATE DON_HANG 
       SET TRANG_THAI_DON_HANG = 'Đã hủy', 
           NGAY_CAP_NHAT_DONHANG = NOW() 
       WHERE ID_ODER = ? AND MA_KH = ?`,
      [orderId, userId] // Đảm bảo chỉ người dùng đó mới có thể cập nhật đơn hàng của mình
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        EM: "Cập nhật trạng thái đơn hàng thành công",
        EC: 1,
        DT: [],
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy đơn hàng này",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng",
      EC: 0,
      DT: [],
    });
  }
};
// Cập nhật trạng thái đơn hàng là "Đã hủy" ADMIN
const updateOrderStatusCanceled = async (req, res) => {
  const { orderId } = req.params; // ID đơn hàng từ tham số URL
  console.log("orderId", orderId);
  try {
    // Cập nhật trạng thái đơn hàng
    const [result] = await connection.execute(
      `UPDATE hoadon 
       SET GHI_CHU_HOA_DON = 'Đã hủy', 
           NGAY_LAP_HOA_DON = NOW() 
       WHERE MAHD = ?`,
      [orderId] // Tham số orderId để xác định đơn hàng cần cập nhật
    );
    console.log("result", result);
    if (result.affectedRows > 0) {
      return res.status(200).json({
        EM: "Cập nhật trạng thái đơn hàng thành công",
        EC: 1,
        DT: [],
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy đơn hàng",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng",
      EC: 0,
      DT: [],
    });
  }
};

// Cập nhật trạng thái đơn hàng là "Giao dịch thành công" ADMIN

const updateOrderStatusSuccess = async (req, res) => {
  const { orderId } = req.params; // ID đơn hàng từ tham số URL
  console.log("orderId", orderId);

  let conn; // Khai báo biến kết nối

  try {
    // Lấy kết nối từ pool
    conn = await connection.getConnection();

    // Bắt đầu giao dịch
    await conn.beginTransaction();

    // Cập nhật trạng thái đơn hàng
    const [result] = await conn.execute(
      `UPDATE hoadon 
       SET GHI_CHU_HOA_DON = 'Giao dịch thành công', 
           NGAY_LAP_HOA_DON = NOW() 
       WHERE MAHD = ?`,
      [orderId]
    );

    if (result.affectedRows > 0) {
      // Lấy danh sách chi tiết đơn hàng (sản phẩm)
      const [orderDetails] = await conn.execute(
        `SELECT MASP, SO_LUONG FROM chi_tiet_hoa_don WHERE MAHD = ?`,
        [orderId]
      );

      // Không cần trừ số lượng sản phẩm vì là game
      // Bỏ qua thao tác trừ số lượng sản phẩm trong bảng SAN_PHAM

      // Nếu tất cả các thao tác thành công, commit giao dịch
      await conn.commit();

      return res.status(200).json({
        EM: "Cập nhật trạng thái đơn hàng thành công",
        EC: 1,
        DT: [],
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy đơn hàng",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    // Nếu có lỗi, rollback giao dịch
    if (conn) {
      await conn.rollback();
    }
    console.error("Error updating order status:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng",
      EC: 0,
      DT: [],
    });
  } finally {
    // Giải phóng kết nối
    if (conn) {
      conn.release();
    }
  }
};

const getDonHangGiaoDichThanhCong = async (req, res) => {
  try {
    // Lấy dữ liệu đơn hàng có GHI_CHU_HOA_DON là "Giao dịch thành công"
    const [results] = await connection.execute(`
      SELECT 
        -- Dữ liệu từ bảng Hóa Đơn
        h.MAHD, 
        h.MA_THANH_TOAN, 
        h.MA_KH, 
        h.DIA_CHI_SHIP, 
        h.SDT_LIEN_HE_KH, 
        h.NGAY_LAP_HOA_DON, 
        h.GHI_CHU_HOA_DON, 
        h.TONG_TIEN,
        
        -- Dữ liệu từ bảng Thanh Toán
        t.CACH_THANH_TOAN, 
        t.GHI_CHU_THANH_TOAN,
        
        -- Dữ liệu từ bảng Khách Hàng
        k.TEN_KHACH_HANG, 
        k.DIA_CHI, 
        k.SDT_KH, 
        k.GHI_CHU_KH, 
        k.DIA_CHI_Provinces, 
        k.DIA_CHI_Wards, 
        k.DIA_CHI_STREETNAME, 
        k.DIA_CHI_Districts, 
        k.NGAY_SINH, 
        k.AVATAR, 
        k.GHI_CHU_KH,
        
        -- Dữ liệu từ bảng Chi Tiết Hóa Đơn
        c.MA_CTHD, 
        c.MASP, 
        c.SO_LUONG, 
        c.GIA_SP_KHI_MUA, 
        c.GIAM_GIA_KHI_MUA, 
        c.GHI_CHU_CTHD, 
        c.BINH_LUAN, 
        c.DANH_GIA,
        
        -- Dữ liệu từ bảng Sản Phẩm
        p.TENSP, 
        p.DON_GIA, 
        p.NHA_SAN_XUAT, 
        p.ANH_SP, 
        p.GHI_CHU_SP, 
        p.TRANG_THAI_SAN_PHAM,
        
        -- Dữ liệu từ bảng Thể Loại
        tl.TENTL, 
        tl.MO_TA_TL, 
        tl.GHI_CHU_TL

      FROM 
        hoadon h
      LEFT JOIN 
        thanh_toan t ON h.MA_THANH_TOAN = t.MA_THANH_TOAN
      LEFT JOIN 
        khachhang k ON h.MA_KH = k.MA_KH
      LEFT JOIN 
        chi_tiet_hoa_don c ON h.MAHD = c.MAHD
      LEFT JOIN 
        sanpham p ON c.MASP = p.MASP
      LEFT JOIN 
        thuoc_loai tl1 ON p.MASP = tl1.MASP
      LEFT JOIN 
        theloai tl ON tl1.MATL = tl.MATL
      WHERE 
        h.GHI_CHU_HOA_DON = 'Giao dịch thành công'
      ORDER BY 
        h.NGAY_LAP_HOA_DON DESC;
    `);

    return res.status(200).json({
      EM: "Lấy danh sách đơn hàng giao dịch THÀNH CÔNG thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting don hang with 'Giao dịch thành công':", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};
const getDonHangGiaoDichProcess = async (req, res) => {
  try {
    // Lấy dữ liệu đơn hàng có GHI_CHU_HOA_DON là "Giao dịch thành công"
    const [results] = await connection.execute(`
     SELECT 
    h.MAHD, 
    h.MA_THANH_TOAN, 
    h.MA_KH, 
    h.DIA_CHI_SHIP, 
    h.SDT_LIEN_HE_KH, 
    h.NGAY_LAP_HOA_DON, 
    h.GHI_CHU_HOA_DON, 
    h.TONG_TIEN,

    -- Thanh Toán
    t.CACH_THANH_TOAN, 
    t.GHI_CHU_THANH_TOAN,

    -- Khách Hàng
    k.TEN_KHACH_HANG, 
    k.DIA_CHI, 
    k.SDT_KH, 
    k.GHI_CHU_KH, 
    k.DIA_CHI_Provinces, 
    k.DIA_CHI_Wards, 
    k.DIA_CHI_STREETNAME, 
    k.DIA_CHI_Districts, 
    k.NGAY_SINH, 
    k.AVATAR, 
    k.GHI_CHU_KH,

    -- Chi Tiết Hóa Đơn
    GROUP_CONCAT(DISTINCT c.MA_CTHD ORDER BY c.MA_CTHD SEPARATOR ', ') AS MA_CTHD,
    GROUP_CONCAT(DISTINCT c.MASP ORDER BY c.MASP SEPARATOR ', ') AS MASP,
    GROUP_CONCAT(DISTINCT c.SO_LUONG ORDER BY c.SO_LUONG SEPARATOR ', ') AS SO_LUONG,
    GROUP_CONCAT(DISTINCT c.GIA_SP_KHI_MUA ORDER BY c.GIA_SP_KHI_MUA SEPARATOR ', ') AS GIA_SP_KHI_MUA,
    GROUP_CONCAT(DISTINCT c.GIAM_GIA_KHI_MUA ORDER BY c.GIAM_GIA_KHI_MUA SEPARATOR ', ') AS GIAM_GIA_KHI_MUA,
    GROUP_CONCAT(DISTINCT c.GHI_CHU_CTHD ORDER BY c.GHI_CHU_CTHD SEPARATOR ', ') AS GHI_CHU_CTHD,

    -- Sản Phẩm
    GROUP_CONCAT(DISTINCT p.TENSP ORDER BY p.TENSP SEPARATOR ', ') AS TENSP,
    GROUP_CONCAT(DISTINCT p.DON_GIA ORDER BY p.DON_GIA SEPARATOR ', ') AS DON_GIA,
    GROUP_CONCAT(DISTINCT p.NHA_SAN_XUAT ORDER BY p.NHA_SAN_XUAT SEPARATOR ', ') AS NHA_SAN_XUAT,
    GROUP_CONCAT(DISTINCT p.ANH_SP ORDER BY p.ANH_SP SEPARATOR ', ') AS ANH_SP,

    -- Thể Loại
    GROUP_CONCAT(DISTINCT tl.TENTL ORDER BY tl.TENTL SEPARATOR ', ') AS TENTL

FROM 
    hoadon h
LEFT JOIN 
    thanh_toan t ON h.MA_THANH_TOAN = t.MA_THANH_TOAN
LEFT JOIN 
    khachhang k ON h.MA_KH = k.MA_KH
LEFT JOIN 
    chi_tiet_hoa_don c ON h.MAHD = c.MAHD
LEFT JOIN 
    sanpham p ON c.MASP = p.MASP
LEFT JOIN 
    thuoc_loai tl1 ON p.MASP = tl1.MASP
LEFT JOIN 
    theloai tl ON tl1.MATL = tl.MATL
WHERE 
    h.GHI_CHU_HOA_DON = 'Đang chờ thanh toán'
GROUP BY 
    h.MAHD
ORDER BY 
    h.NGAY_LAP_HOA_DON DESC;

    `);

    return res.status(200).json({
      EM: "Lấy danh sách đơn hàng Đang chờ thanh toán thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting don hang with 'Đang chờ thanh toán':", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};
module.exports = {
  getDON_HANG,
  getDonHangGiaoDichThanhCong,
  createDON_HANG,
  updateDON_HANG,
  deleteDON_HANG,
  updateTrangThaiDonHang,
  getDON_HANG_ByIDUser,
  updateOrderStatusCanceled_User,
  updateOrderStatusCanceled,
  updateOrderStatusSuccess,
  getDonHangGiaoDichProcess,
};
