const express = require("express");
const router = express.Router();
const {
  getProductReviews,
  updateProductReview,
} = require("../../controller/CustomerController.js/binhLuanController");
// 1. Lấy danh sách bình luận
router.get("/:id", getProductReviews);
router.put("/:id", updateProductReview);

module.exports = router;
