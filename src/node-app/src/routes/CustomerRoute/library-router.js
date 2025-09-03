const express = require("express");
const router = express.Router();

const {
  LichSuMuaHangCaNhan,
  laydanhsachgamecanhanwishlist,
} = require("../../controller/CustomerController.js/libraryController");

router.post("/use/LichSuMuaHangCaNhan", LichSuMuaHangCaNhan);
router.post(
  "/use/laydanhsachgamecanhanwishlist",
  laydanhsachgamecanhanwishlist
);

module.exports = router;
