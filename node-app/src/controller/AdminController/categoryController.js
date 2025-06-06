const {
  tao_theloai,
  xem_tatca_theloai,
  xem_theloai_id,
  sua_theloai_id,
  xoa_theloai_id,
} = require("../../services/AdminServices/categoryServices");

const tao_new_theloai = async (req, res) => {
  try {
    const TENTL = req.body.TENTL;
    const MO_TA_TL = req.body.MO_TA_TL;
    let results = await tao_theloai(TENTL, MO_TA_TL);
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

const xemtatca_theloai = async (req, res) => {
  try {
    let results = await xem_tatca_theloai();
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

const xem_theloai_voi_id = async (req, res) => {
  try {
    const MATL = req.body.MATL;
    let results = await xem_theloai_id(MATL);
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

const sua_theloai_voi_id = async (req, res) => {
  try {
    const MATL = req.params.MATL;
    const TENTL = req.body.TENTL;
    const MO_TA_TL = req.body.MO_TA_TL;

    let results = await sua_theloai_id(MATL, TENTL, MO_TA_TL);
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

const xoa_theloai_voi_id = async (req, res) => {
  try {
    const MATL = req.body.MATL;

    console.log("checlk,", MATL);
    let results = await xoa_theloai_id(MATL);
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
  tao_new_theloai,
  xem_theloai_voi_id,
  xemtatca_theloai,
  sua_theloai_voi_id,
  xoa_theloai_voi_id,
};
