const express = require("express");
const db = require("../../config/database"); // Assuming you have a database module to handle DB operations

const router = express.Router();

// Update user information
const updateUserByAdmin = async (req, res) => {
  const userId = req.params.id;

  // Danh sách các trường cho phép cập nhật
  const allowedFields = [
    "ID_ROLE",
    "EMAIL",
    "FIRSTNAME",
    "LASTNAME",
    "PHONENUMBER",
    "CODEADDRESS",
    "ADDRESS",
    "PASSWORD",
    "CREATEAT",
    "UPDATEAT",
    "ISDELETE",
  ];

  // Lấy danh sách trường cần cập nhật
  const updates = [];
  const values = [];

  for (const key of allowedFields) {
    const fieldValue = req.body[key];

    // Kiểm tra nếu giá trị là undefined hoặc rỗng thì không thêm vào danh sách cập nhật
    if (fieldValue !== undefined && fieldValue !== null && fieldValue !== "") {
      updates.push(`${key} = ?`);
      values.push(fieldValue);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  try {
    const query = `
        UPDATE user
        SET ${updates.join(", ")}
        WHERE ID_USER = ?
      `;
    values.push(userId); // Thêm userId vào cuối giá trị để dùng trong WHERE

    await db.query(query, values); // Thực thi câu lệnh SQL
    return res.status(200).json({
      EM: "Cập nhật thông tin người dùng thành công",
      EC: 1,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      EM: error.message,
      EC: -1,
      DT: null,
    });
  }
};

module.exports = {
  updateUserByAdmin,
};
