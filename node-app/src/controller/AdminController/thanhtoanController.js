const {
  tao_thanh_toan,
  xem_tatca_thanh_toan,
  xem_thanh_toan_id,
  sua_thanh_toan_id,
  xoa_thanh_toan_id,
} = require("../../services/AdminServices/thanhtoanServices");
const connection = require("../../config/database");
const tao_new_thanh_toan = async (req, res) => {
  try {
    const { CACH_THANH_TOAN, GHI_CHU_THANH_TOAN } = req.body;
    let results = await tao_thanh_toan(CACH_THANH_TOAN, GHI_CHU_THANH_TOAN);
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
const getTHANH_TOAN_Use = async (req, res) => {
  try {
    const [results] = await connection.execute(
      "SELECT * FROM `thanh_toan` where TRANG_THAI_THANH_TOAN = 1"
    );
    return res.status(200).json({
      EM: "Xem thông tin thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error getting thanh toan:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi lấy thông tin",
      EC: 0,
      DT: [],
    });
  }
};
const xemtatca_thanh_toan = async (req, res) => {
  try {
    let results = await xem_tatca_thanh_toan();
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

const xem_thanh_toan_voi_id = async (req, res) => {
  try {
    const MA_THANH_TOAN = req.body.MA_THANH_TOAN;
    let results = await xem_thanh_toan_id(MA_THANH_TOAN);
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

const sua_thanh_toan_voi_id = async (req, res) => {
  try {
    const MA_THANH_TOAN = req.params.MA_THANH_TOAN;
    const { CACH_THANH_TOAN, GHI_CHU_THANH_TOAN } = req.body;
    let results = await sua_thanh_toan_id(
      MA_THANH_TOAN,
      CACH_THANH_TOAN,
      GHI_CHU_THANH_TOAN
    );
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

const xoa_thanh_toan_voi_id = async (req, res) => {
  try {
    const MA_THANH_TOAN = req.params.MA_THANH_TOAN;
    let results = await xoa_thanh_toan_id(MA_THANH_TOAN);
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
  tao_new_thanh_toan,
  xem_thanh_toan_voi_id,
  xemtatca_thanh_toan,
  sua_thanh_toan_voi_id,
  xoa_thanh_toan_voi_id,
  getTHANH_TOAN_Use,
};
