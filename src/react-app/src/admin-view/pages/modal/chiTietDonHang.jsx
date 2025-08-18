import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Grid,
  TableContainer,
  Paper,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { getThemeConfig } from "../../../service/themeService";
import * as XLSX from "xlsx";
const ProductDetailModal = ({ productId, onClose }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const api = process.env.REACT_APP_URL_SERVER;

  // Hàm lấy thông tin chi tiết sản phẩm
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${api}/chi-tiet-hoa-don/${productId}`);
      if (response.data) {
        setProductDetails(response.data.DT.chiTietHoaDon); // Lưu dữ liệu vào state
        setOrderInfo(response.data.DT.hoaDon)
      }
      console.log("response.data.DT:::::", response.data.DT.chiTietHoaDon)
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleExportToExcel = () => {
    if (!productDetails) return;

    const { chiTietHoaDon, MAHD, TONG_TIEN, TEN_DANG_NHAP, DIA_CHI_SHIP } =
      productDetails;

    // Tạo dữ liệu bảng sản phẩm
    const data = chiTietHoaDon.map((item) => ({
      "Tên sản phẩm": item.TENSP,
      "Giá sản phẩm": item.DON_GIA,
      "Số lượng": item.SO_LUONG,
      "Thành tiền": item.GIA_SP_KHI_MUA * item.SO_LUONG,
      "Nhà sản xuất": item.NHA_SAN_XUAT,
      "Thể loại": item.TENTL,
      "Mô tả": item.MO_TA_TL,
    }));

    // Tạo dữ liệu thông tin hóa đơn dưới dạng một hàng duy nhất
    const summaryData = [
      {
        "Mã hóa đơn": MAHD || "",
        "Khách hàng": TEN_DANG_NHAP || "",
        "Địa chỉ": DIA_CHI_SHIP || "",
        "Tổng tiền": TONG_TIEN || 0,
      },
    ];

    // Tạo workbook
    const workbook = XLSX.utils.book_new();

    // Tạo sheet thông tin hóa đơn (hiển thị trên cùng một dòng)
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);

    // Tạo sheet chi tiết sản phẩm
    const productSheet = XLSX.utils.json_to_sheet(data);

    // Thêm các sheet vào workbook
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Thông tin hóa đơn");
    XLSX.utils.book_append_sheet(workbook, productSheet, "Chi tiết sản phẩm");

    // Xuất file Excel
    XLSX.writeFile(workbook, `HoaDon_${MAHD || "khachhang"}.xlsx`);
  };

  // Fetch thông tin chi tiết khi productId thay đổi
  useEffect(() => {
    if (productId) {
      fetchProductDetails(); // Gọi hàm fetchProductDetails khi có productId
    }
  }, [productId]);

  if (!productDetails) return null; // Nếu chưa có dữ liệu thì không render gì

  const { chiTietHoaDon } = productDetails;

  return (
    <Dialog open={Boolean(productId)} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Cột bên trái chứa thông tin khách hàng */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6">Thông tin khách hàng:</Typography>
            <Typography>Email: {orderInfo.EMAIL}</Typography>
            <Typography>
              Số điện thoại: {orderInfo.PHONENUMBER}
            </Typography>
            <Typography>
              Địa chỉ đơn hàng: {orderInfo.ADDRESS}
            </Typography>
            <Typography>
              Ngày tạo đơn hàng:{" "}
              {new Date(orderInfo.CREATEAT).toLocaleString(
                "vi-VN"
              )}
            </Typography>
            <Typography>
              Phương thức thanh toán: {orderInfo.PAYMENTMETHOD}
            </Typography>
            <Typography>
              Trạng thái đơn hàng: {orderInfo.STATUS}
            </Typography>
            <Typography>Mã đơn hàng: {orderInfo.ID_ORDER || ""}</Typography>
            <Typography>
              Tổng tiền đơn hàng:{" "}
              <b>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderInfo.TOTALORDERPRICE || 0)}
              </b>
            </Typography>
          </Grid>

          {/* Cột bên phải chứa Avatar */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Thông tin người dùng:</Typography>
            <Avatar
              src={`${api}/images/${orderInfo.AVATAR}`}
              alt="Avatar"
              sx={{ width: 100, height: 100 }}
            />
            <Typography>
              Họ tên: {orderInfo.FIRSTNAME} {orderInfo.LASTNAME}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Thông tin sản phẩm:
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Thành tiền</TableCell>
                <TableCell>Nhà sản xuất</TableCell>
                <TableCell>Thể loại</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Ảnh</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productDetails.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.NAME_PRODUCTDETAILS}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.UNIT_PRICE || 0)}
                  </TableCell>
                  <TableCell>{item.QUANTITY}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.UNIT_PRICE * item.QUANTITY || 0)}
                  </TableCell>
                  <TableCell>{item.BRAND_NAME}</TableCell>
                  <TableCell>{item.NAME_CATEGORY}</TableCell>
                  <TableCell>{item.SHORTDESCRIPTION}</TableCell>
                  <TableCell>
                    <img
                      src={`${api}/images/${item.GALLERYPRODUCT_DETAILS}`}
                      alt="Sản phẩm"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
        <Button onClick={handleExportToExcel} color="secondary">
          Xuất Excel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailModal;
