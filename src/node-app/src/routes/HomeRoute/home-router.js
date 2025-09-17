const express = require("express");
const router = express.Router();

const {
  laydanhsachgamemoiramat,
  laydanhsach4gamegiamgianhieunhat,
  laydanhsachcacgamengaunhien,
  danhsach5gameyeuthichnhat,
  laydanhsach5gamebanchaynhat,
  laydanhsach5gamemacnhat,
  timkiem5gametheoten,
  danhsachusermuahang,
  tongsoluongcuatop3,
  danhsachordertheotime,
  laytongsoluongnhieunhat,
  DuLieu_chartData
} = require("../../controller/HomeController/HomeController");

router.get("/use/5game-banchaynhat", laydanhsach5gamebanchaynhat);
router.get("/use/game-moiramat", laydanhsachgamemoiramat);
router.get("/use/4game-giamgia", laydanhsach4gamegiamgianhieunhat);
router.get("/use/5game-random", laydanhsachcacgamengaunhien);
router.get("/use/5game-macnhat", laydanhsach5gamemacnhat);
router.get("/use/5game-yeuthich", danhsach5gameyeuthichnhat);
router.get("/use/danhsachkhachhang", danhsachusermuahang);
router.get("/use/tongsoluongcuatop3", tongsoluongcuatop3);
router.post("/use/danhsachordertheotime", danhsachordertheotime);
router.get("/use/laytongsoluongnhieunhat", laytongsoluongnhieunhat);

router.post("/use/DuLieu_chartData", DuLieu_chartData);
router.post("/use/timkiem", timkiem5gametheoten); // tìm kiếm 5 sản phẩm theo tên, ĐÂY LÀ CÁI SEARCH
module.exports = router;
