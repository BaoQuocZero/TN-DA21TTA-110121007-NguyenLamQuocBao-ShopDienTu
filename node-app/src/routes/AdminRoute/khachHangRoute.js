const express = require("express");
const router = express.Router();
const {
  updateUserByAdmin,
} = require("../../controller/AdminController/khachHangController");

router.put("/updateUser/:id", updateUserByAdmin);

module.exports = router;
