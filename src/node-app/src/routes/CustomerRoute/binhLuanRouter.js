const express = require("express");
const router = express.Router();
const {
  onAddComment,
  getProductReviews,
  updateProductReview,
} = require("../../controller/CustomerController.js/binhLuanController");
router.post("/tao", onAddComment);
router.get("/:id", getProductReviews);
router.put("/:id", updateProductReview);

module.exports = router;
