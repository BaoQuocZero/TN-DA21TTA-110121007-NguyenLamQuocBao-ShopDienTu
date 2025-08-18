const connection = require("../../config/database");

const getAllCartItems = async (req, res) => {
  try {
    const maKhachHang = req.body.ID_USER; // Lấy mã khách hàng từ body request

    // Truy vấn danh sách sản phẩm trong giỏ hàng (chỉ lấy một bản ghi cho mỗi sản phẩm)
    const [results] = await connection.execute(
      `
      SELECT 
      cart_item.QUANTITY, cart_item.TOTAL_PRICE, 
      product_details.*,
      brand.NAME AS brand_NAME,
      category.NAME_CATEGORY, category.DESCRIPTION AS category_DESCRIPTION
      FROM cart_item
      JOIN product_details ON product_details.ID_PRODUCTDETAILS = cart_item.ID_PRODUCTDETAILS
      JOIN product ON product.ID_PRODUCT = product_details.ID_PRODUCT
      JOIN brand ON brand.ID_BRAND = product.ID_BRAND
      JOIN category ON category.ID_CATEGORY = product.ID_CATEGORY
      JOIN cart ON cart.ID_CART = cart_item.ID_CART
      WHERE cart.ID_USER = ?
      `,
      [maKhachHang]
    );

    // Truy vấn tổng số lượng sản phẩm và tổng tiền trong giỏ hàng
    const [cartSummary] = await connection.execute(
      `
      SELECT 
        SUM(cart_item.QUANTITY) AS totalQuantity,
        SUM(cart_item.TOTAL_PRICE) AS totalPrice
      FROM cart_item
      JOIN cart ON cart.ID_CART = cart_item.ID_CART
      WHERE cart.ID_USER = ?
  `,
      [maKhachHang]
    );

    // Trả về danh sách sản phẩm trong giỏ hàng
    return res.status(200).json({
      EM: "Xem thông tin sản phẩm trong giỏ hàng thành công",
      EC: 1,
      DT: {
        results, // Danh sách sản phẩm kèm thông tin chi tiết và tổng số lượng
        cartSummary, // Tổng số lượng và tổng tiền
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Lỗi server nội bộ",
      error: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { ID_USER, ID_PRODUCTDETAILS } = req.body;
    // console.log("req.bodyreq.bodyreq.bodyreq.body: ", req.body)
    if (!ID_USER || !ID_PRODUCTDETAILS) {
      return res.status(200).json({
        EM: "Mã người dùng hoặc mã sản phẩm không tồn tại",
        EC: 0,
        DT: [],
      });
    }

    // 1. Kiểm tra giỏ hàng của người dùng
    const [cart] = await connection.execute(
      `SELECT * FROM cart WHERE ID_USER = ? AND ISDELETE = 0`,
      [ID_USER]
    );

    let cartId;
    if (cart.length === 0) {
      // 2. Chưa có giỏ → tạo mới
      const [result] = await connection.execute(
        `INSERT INTO cart (ID_USER, CREATEAT, UPDATEAT, ISDELETE)
         VALUES (?, NOW(), NOW(), 0)`,
        [ID_USER]
      );
      cartId = result.insertId;
    } else {
      cartId = cart[0].ID_CART;
    }

    // 3. Kiểm tra sản phẩm trong giỏ hàng
    const [existingItem] = await connection.execute(
      `SELECT * FROM cart_item 
       WHERE ID_CART = ? AND ID_PRODUCTDETAILS = ? AND ISDELETE = 0`,
      [cartId, ID_PRODUCTDETAILS]
    );

    // Lấy thông tin sản phẩm (bao gồm giá)
    const [productDetails] = await connection.execute(
      `SELECT PRICE_PRODUCTDETAILS FROM product_details WHERE ID_PRODUCTDETAILS = ?`,
      [ID_PRODUCTDETAILS]
    );

    if (productDetails.length === 0) {
      return res.status(200).json({
        EM: "Sản phẩm không tồn tại",
        EC: 0,
        DT: [],
      });
    }

    const price = productDetails[0].PRICE_PRODUCTDETAILS;

    if (existingItem.length > 0) {
      // Tăng số lượng và cập nhật tổng giá
      await connection.execute(
        `UPDATE cart_item 
     SET QUANTITY = QUANTITY + 1, 
         TOTAL_PRICE = (QUANTITY + 1) * ?, 
         UPDATEAT = NOW() 
     WHERE ID_CART = ? AND ID_PRODUCTDETAILS = ?`,
        [price, cartId, ID_PRODUCTDETAILS]
      );
    } else {
      // Thêm mới
      await connection.execute(
        `INSERT INTO cart_item 
     (ID_PRODUCTDETAILS, ID_CART, QUANTITY, TOTAL_PRICE, CREATEAT, UPDATEAT, ISDELETE) 
     VALUES (?, ?, 1, ?, NOW(), NOW(), 0)`,
        [ID_PRODUCTDETAILS, cartId, price]
      );
    }

    // 6. Lấy tổng số lượng sản phẩm trong giỏ
    const [totalResults] = await connection.execute(
      `SELECT SUM(QUANTITY) AS totalQuantity 
       FROM cart_item 
       WHERE ID_CART = ? AND ISDELETE = 0`,
      [cartId]
    );

    const totalQuantity = totalResults[0]?.totalQuantity || 0;

    return res.status(200).json({
      EM: "Thêm vào giỏ hàng thành công",
      EC: 1,
      DT: totalQuantity,
      totalQuantity: totalQuantity,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(200).json({
      EM: "Đã xảy ra lỗi",
      EC: -1,
      DT: [],
    });
  }
};

// Đang sử dụng
const removeCartItem = async (req, res) => {
  try {
    const { ID_USER, ID_PRODUCTDETAILS } = req.body;

    // Xóa sản phẩm trong giỏ hàng của đúng user
    const [deleteResult] = await connection.execute(
      `
      DELETE cart_item
      FROM cart_item
      JOIN cart ON cart.ID_CART = cart_item.ID_CART
      WHERE cart.ID_USER = ? AND cart_item.ID_PRODUCTDETAILS = ?
      `,
      [ID_USER, ID_PRODUCTDETAILS]
    );

    return res.status(200).json({
      EM: "Xóa sản phẩm khỏi giỏ hàng thành công",
      EC: 1,
      DT: deleteResult,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      EM: "Xóa sản phẩm khỏi giỏ hàng thất bại",
      EC: -1,
      DT: [],
    });
  }
};

module.exports = {
  getAllCartItems,
  addToCart,

  removeCartItem,
};
