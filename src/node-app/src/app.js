const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3307;
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("./config/database");
const configViewEngine = require("./config/ViewEngine");
const moment = require("moment");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const axios = require("axios");
const knn = require("ml-knn");

// Router =========================================================================
const CRUDTaiKhoan = require("./routes/AdminRoute/AdminManageRoute");
const CRUDTheLoai = require("./routes/AdminRoute/CategoryRoute");
const CRUDSanpham = require("./routes/AdminRoute/ProductRoute");
const CRUDGiamgia = require("./routes/AdminRoute/GiamgiaRoute");
const KhachHangRoute = require("./routes/CustomerRoute/KhachHangRoute");
const AccountRoute = require("./routes/accountUserRoute");

const CRUDThanhToan = require("./routes/AdminRoute/thanhtoanRoute");
const CRUDSanphamUutien = require("./routes/AdminRoute/sanphamUTRoute");
const QuanLyDonHangRoute = require("./routes/AdminRoute/QuanLyDonHangRoute");

const HomeRoute = require("./routes/HomeRoute/home-router");
const giohangRoute = require("./routes/CustomerRoute/giohang-route");
const yeuthichRoute = require("./routes/CustomerRoute/yeuthich-route");
const binhLuanRoute = require("./routes/CustomerRoute/binhLuanRouter");
const donHangRoute = require("./routes/CustomerRoute/donHangRouter");
const libraryRoute = require("./routes/CustomerRoute/library-router");
const KhachHangRouter = require("./routes/AdminRoute/khachHangRoute");
const ThanhToanOnlineRoute = require("./routes/AdminRoute/thanhToanOnlineRoute");
const ChiTietHoaDonRoute = require("./routes/AdminRoute/chiTietHoaDonRouter");

const CRUDBrand = require("./routes/AdminRoute/BrandRoute");
const Promotion = require("./routes/AdminRoute/PromotionRoute");
const corsOptions = {
  origin: process.env.URL_REACT, // Cho phép truy cập từ tất cả các nguồn
  credentials: true, // Cho phép gửi cookie
};

//===============================sử dụng các dependency
app.use(cors(corsOptions));
// app.use(cors());

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));
configViewEngine(app);
//===============================

//route config ========================================================================================
app.use("/binh-luan/", binhLuanRoute);
app.use("/don-hang/", donHangRoute);
app.use("/khach-hang/", KhachHangRouter);
app.use("/thanh-toan-online/", ThanhToanOnlineRoute);
app.use("/chi-tiet-hoa-don/", ChiTietHoaDonRoute);

CRUDSanpham(app);
CRUDTaiKhoan(app);
CRUDTheLoai(app);
CRUDGiamgia(app);
KhachHangRoute(app);
AccountRoute(app);

CRUDThanhToan(app);
CRUDSanphamUutien(app);
QuanLyDonHangRoute(app);
giohangRoute(app);
yeuthichRoute(app);

CRUDBrand(app);
Promotion(app);
app.use("/api/home", HomeRoute);
app.use("/api", libraryRoute);
//=====================================================================================================

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
