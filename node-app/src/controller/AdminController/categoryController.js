const {
  tao_theloai,
  xem_tatca_theloai,
  xem_theloai_id,
  sua_theloai_id,
  xoa_theloai_id,
} = require("../../services/AdminServices/categoryServices");

const tao_new_theloai = async (req, res) => {
  try {
    console.log("Tạo thể loại ::::::", req.body);
    const { NAME, PARENTID, DESCRIPTION, ISDELETE } = req.body;

    const result = await tao_theloai(NAME, PARENTID, DESCRIPTION, ISDELETE);

    return res.status(200).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT,
    });
  } catch (error) {
    console.error("Lỗi tạo thể loại:", error);
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
    const ID_CATEGORY = req.params.ID_CATEGORY;
    const { NAME, PARENTID, DESCRIPTION, ISDELETE } = req.body;
    const results = await sua_theloai_id(ID_CATEGORY, NAME, PARENTID, DESCRIPTION, ISDELETE);

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
    const ID_CATEGORY = req.body.ID_CATEGORY;

    console.log("ID cần xoá:", ID_CATEGORY);

    const results = await xoa_theloai_id(ID_CATEGORY);
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
