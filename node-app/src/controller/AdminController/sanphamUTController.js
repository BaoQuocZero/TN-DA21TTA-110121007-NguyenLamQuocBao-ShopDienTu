const {
  tao_danhsach_uu_tien,
  xem_tatca_danhsach_uu_tien,
  xem_danhsach_uu_tien_theo_masp,
  sua_danhsach_uu_tien,
  xoa_danhsach_uu_tien,
} = require("../../services/AdminServices/sanphamUTServices");

const tao_new_sanpham_uutien = async (req, res) => {
  try {
    const MASP = req.body.MASP;
    // const THOI_GIAN_BAT_DAU_UT = req.body.THOI_GIAN_BAT_DAU_UT;
    // const THOI_GIAN_KET_THUC_UT = req.body.THOI_GIAN_KET_THUC_UT;
    const GHI_CHU_UT = req.body.GHI_CHU_UT;

    // Kiểm tra các tham số bắt buộc
    if (!MASP || !GHI_CHU_UT) {
      return res.status(400).json({
        EM: "Thiếu thông tin đầu vào",
        EC: 0,
        DT: [],
      });
    }

    // Kiểm tra nếu tất cả các ảnh đã được tải lên
    if (!req.files || req.files.length < 3) {
      return res.status(400).json({
        EM: "Thiếu ảnh yêu cầu",
        EC: 0,
        DT: [],
      });
    }

    // Lấy các hình ảnh từ form data
    const HINH_ANH_BIA = req.files["HINH_ANH_BIA"]
      ? req.files["HINH_ANH_BIA"][0].filename
      : null;
    const HINH_ANH_LOGO = req.files["HINH_ANH_LOGO"]
      ? req.files["HINH_ANH_LOGO"][0].filename
      : null;
    const HINH_ANH_NAVBAR = req.files["HINH_ANH_NAVBAR"]
      ? req.files["HINH_ANH_NAVBAR"][0].filename
      : null;

    console.log({ HINH_ANH_BIA, HINH_ANH_LOGO, HINH_ANH_NAVBAR });

    // Gọi hàm tạo danh sách ưu tiên
    let results = await tao_danhsach_uu_tien(
      MASP,

      GHI_CHU_UT,
      HINH_ANH_BIA,
      HINH_ANH_LOGO,
      HINH_ANH_NAVBAR
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

const xemtatca_sanpham_uutien = async (req, res) => {
  try {
    let results = await xem_tatca_danhsach_uu_tien();
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

const xem_sanpham_uutien_voi_id = async (req, res) => {
  try {
    const MASANPHAMUUTIEN = req.params.MASANPHAMUUTIEN;
    let results = await xem_danhsach_uu_tien_theo_masp(MASANPHAMUUTIEN);
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

const sua_sanpham_uutien_voi_id = async (req, res) => {
  try {
    const MASANPHAMUUTIEN = req.params.MASANPHAMUUTIEN;
    console.log("req.body", req.body);
    const { GHI_CHU_UT, MASP } = req.body;

    console.log({ MASANPHAMUUTIEN, MASP, GHI_CHU_UT });
    let results = await sua_danhsach_uu_tien(
      MASANPHAMUUTIEN,
      MASP,

      GHI_CHU_UT
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

const xoa_sanpham_uutien_voi_id = async (req, res) => {
  try {
    const MASANPHAMUUTIEN = req.params.MASANPHAMUUTIEN;

    let results = await xoa_danhsach_uu_tien(MASANPHAMUUTIEN);
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
  tao_new_sanpham_uutien,
  xem_sanpham_uutien_voi_id,
  xemtatca_sanpham_uutien,
  sua_sanpham_uutien_voi_id,
  xoa_sanpham_uutien_voi_id,
};
