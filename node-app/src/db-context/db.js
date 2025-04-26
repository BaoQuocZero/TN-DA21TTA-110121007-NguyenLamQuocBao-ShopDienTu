require('dotenv').config(); // Load biến môi trường từ file .env
const mysql = require('mysql2');

// Tạo kết nối tới MySQL
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD, // cần thêm dòng này nếu có mật khẩu
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  port: parseInt(process.env.DB_PORT) || 3306,
  queueLimit: 0,
});

// Kiểm tra kết nối đến database
connection.getConnection((err, conn) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Database connection established successfully');
    conn.release(); // Giải phóng kết nối sau khi kiểm tra
  }
});

module.exports = connection.promise();
