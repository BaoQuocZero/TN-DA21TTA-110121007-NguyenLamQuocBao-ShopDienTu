const express = require("express");
const cors = require("cors"); // Import CORS
const http = require("http"); // Nhập khẩu http
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
require('dotenv').config(); // Load biến môi trường từ file .env

const app = express();
const path = require("path"); // Thêm dòng này để import module 'path'

const server = http.createServer(app); // Tạo máy chủ HTTP từ Express
const io = socketIo(server, {
  cors: {
    origin: "*", // Cho phép tất cả nguồn
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});
// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Để xử lý dữ liệu JSON từ body

app.use(express.static(path.join(__dirname, "public")));
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    console.log('Message received: ', msg);
    // Gửi lại tin nhắn tới tất cả client khác
    socket.broadcast.emit('chat message', { ...msg, sender: 'bot' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const userRouter = require("./src/router/User-router");
app.use("/api", userRouter);

// Khởi động server
const PORT = 3002;
console.log("process.env.DB_HOST:  ", process.env.DB_HOST)
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
