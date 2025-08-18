const express = require("express");
const router = express.Router();

const {
  laydanhsachgamecanhan,
  laydanhsachgamecanhanwishlist,
} = require("../../controller/CustomerController.js/libraryController");

router.post("/use/laydanhsachgamecanhan", laydanhsachgamecanhan);
router.post(
  "/use/laydanhsachgamecanhanwishlist",
  laydanhsachgamecanhanwishlist
);

module.exports = router;
