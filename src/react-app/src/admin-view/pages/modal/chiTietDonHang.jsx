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
  Divider,
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
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleExportToExcel = () => {
    if (!productDetails || productDetails.length === 0) return;

    // Tạo dữ liệu bảng sản phẩm
    const data = productDetails.map((item) => ({
      "Tên sản phẩm": item.NAME_PRODUCTDETAILS,
      "Giá sản phẩm": item.UNIT_PRICE,
      "Số lượng": item.QUANTITY,
      "Thành tiền": item.TOTAL_PRICE,
      "Thương hiệu": item.BRAND_NAME,
      "Danh mục": item.NAME_CATEGORY,
      "Mô tả": item.SHORTDESCRIPTION,
      "Ảnh": item.GALLERYPRODUCT_DETAILS,
    }));

    // Nếu có thêm thông tin hóa đơn thì mock 1 row tóm tắt
    const summaryData = [
      {
        "Tổng tiền đơn hàng": productDetails.reduce(
          (sum, item) => sum + item.TOTAL_PRICE,
          0
        ),
        "Tổng số lượng": productDetails.reduce(
          (sum, item) => sum + item.QUANTITY,
          0
        ),
      },
    ];

    // Tạo workbook
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Thông tin hóa đơn
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Thông tin hóa đơn");

    // Sheet 2: Chi tiết sản phẩm
    const productSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, productSheet, "Chi tiết sản phẩm");

    // Xuất file Excel
    XLSX.writeFile(workbook, `HoaDon_${Date.now()}.xlsx`);
  };

  // Fetch thông tin chi tiết khi productId thay đổi
  useEffect(() => {
    if (productId) {
      fetchProductDetails(); // Gọi hàm fetchProductDetails khi có productId
    }
  }, [productId]);

  if (!productDetails) return null; // Nếu chưa có dữ liệu thì không render gì

  const { chiTietHoaDon } = productDetails;

  // Hàm định dạng tiền VND
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);

  // Hàm định dạng ngày
  const formatDate = (date) =>
    new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={Boolean(productId)} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>

      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Thông tin khách hàng
        </Typography>
        <Grid container spacing={2}>
          {/* Cột trái */}
          <Grid item xs={12} md={6}>
            <Typography>Email: {orderInfo.EMAIL}</Typography>
            <Typography>Số điện thoại: {orderInfo.PHONENUMBER}</Typography>
            <Typography>Địa chỉ: {orderInfo.ADDRESS}</Typography>
            <Typography>Ngày tạo: {formatDate(orderInfo.CREATEAT)}</Typography>
          </Grid>

          {/* Cột phải */}
          <Grid item xs={12} md={6}>
            <Typography>Khách hàng: {orderInfo.FIRSTNAME} {orderInfo.LASTNAME}</Typography>
            <Typography>Phương thức thanh toán: {orderInfo.PAYMENTMETHOD}</Typography>
            <Typography>Trạng thái: <b>{orderInfo.STATUS}</b></Typography>
            <Typography>Mã đơn hàng: {orderInfo.ID_ORDER}</Typography>
            <Typography>
              Tổng tiền: <b>{formatCurrency(orderInfo.TOTALORDERPRICE)}</b>
            </Typography>
          </Grid>
        </Grid>


        <Divider sx={{ my: 2 }} />

        {/* Bảng sản phẩm */}
        <Typography variant="h6" gutterBottom>
          Thông tin sản phẩm
        </Typography>
        <TableContainer component={Paper}>
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
                  <TableCell>{formatCurrency(item.UNIT_PRICE)}</TableCell>
                  <TableCell>{item.QUANTITY}</TableCell>
                  <TableCell>{formatCurrency(item.UNIT_PRICE * item.QUANTITY)}</TableCell>
                  <TableCell>{item.BRAND_NAME}</TableCell>
                  <TableCell>{item.NAME_CATEGORY}</TableCell>
                  <TableCell>{item.SHORTDESCRIPTION}</TableCell>
                  <TableCell>
                    <img
                      src={`${api}/images/${item.GALLERYPRODUCT_DETAILS}`}
                      alt="Sản phẩm"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        borderRadius: "4px",
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
        <Button onClick={onClose} color="primary" variant="outlined">
          Đóng
        </Button>
        <Button onClick={() => handleExportToExcel()} color="secondary" variant="contained">
          Xuất Excel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailModal;
