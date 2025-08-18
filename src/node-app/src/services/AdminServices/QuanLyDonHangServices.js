const pool = require("../../config/database");

const Xem_DonHang = async () => {
    try {
      let [results1, fields1] = await pool.execute(`
        SELECT tt.*, hd.*, cthd.* FROM hoadon hd
        JOIN chi_tiet_hoa_don cthd ON cthd.MAHD = hd.MAHD
        JOIN thanh_toan tt ON tt.MA_THANH_TOAN = hd.MA_THANH_TOAN`);
  
      return {
        EM: "Lấy tất cả đơn hàng thành công",
        EC: 1,
        DT: results1,
      };
    } catch (error) {
      return {
        EM: "Lỗi khi lấy tất cả đơn hàng",
        EC: 0,
        DT: [],
      };
    }
  };

  module.exports = {
    Xem_DonHang
  };