const {
  tao_giamgia,
  xem_tatca_giamgia,
  xem_giamgia_id,
  sua_giamgia_id,
  xoa_giamgia_id,
} = require("../../services/AdminServices/giamgiaService");
const tao_new_giamgia = async (req, res) => {
  try {
    const datasanpham = req.body;
    let results = await tao_giamgia(datasanpham);
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

const xemtatca_giamgia = async (req, res) => {
  try {
    let results = await xem_tatca_giamgia();
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

const xem_giamgia_voi_id = async (req, res) => {
  try {
    const MA_GIAM_GIA = req.body.MA_GIAM_GIA;
    let results = await xem_giamgia_id(MA_GIAM_GIA);
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

const sua_giamgia_voi_id = async (req, res) => {
  try {
    const MA_GIAM_GIA = req.params.MA_GIAM_GIA;
    const datasanpham = req.body;
    let results = await sua_giamgia_id(MA_GIAM_GIA, datasanpham);
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

const xoa_giamgia_voi_id = async (req, res) => {
  try {
    const MA_GIAM_GIA = req.body.MA_GIAM_GIA;

    let results = await xoa_giamgia_id(MA_GIAM_GIA);
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
  tao_new_giamgia,
  xemtatca_giamgia,
  xem_giamgia_voi_id,
  sua_giamgia_voi_id,
  xoa_giamgia_voi_id,
};
