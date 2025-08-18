const {
    Xem_DonHang,
  } = require("../../services/AdminServices/QuanLyDonHangServices");

  const Xem_DonHangController = async (req, res) => {
    try {
      let results = await Xem_DonHang();
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
  
  module.exports = {
    Xem_DonHangController,
  };
  