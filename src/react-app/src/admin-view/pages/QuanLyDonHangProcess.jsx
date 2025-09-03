import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import moment from "moment";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Import icon Visibility

import { enqueueSnackbar } from "notistack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { getThemeConfig } from "../../service/themeService";
import ProductDetailModal from "./modal/chiTietDonHang";

const TatCaDonHangAdminProcess = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Trạng thái mở modal
  const [actionType, setActionType] = useState(""); // Loại hành động (success or canceled)
  const [currentOrderId, setCurrentOrderId] = useState(null); // ID đơn hàng hiện tại
  const currentTheme = getThemeConfig(localStorage.getItem("THEMES") || "dark");
  const api = process.env.REACT_APP_URL_SERVER;
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log("DDDDDDDDDDDDDDDDDD")
      const response = await axios.get(`${api}/don-hang/dang-cho-xu-ly`);
      if (response.data.EC === 1) {
        setOrders(response.data.DT);
      }
      console.log("responseresponseresponse: ", response.data.DT)
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleUpdateStatusSuccess = async (orderId) => {
    try {
      // Gửi yêu cầu cập nhật trạng thái "Giao dịch thành công"
      const response = await axios.put(`${api}/don-hang/${orderId}/success`);

      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM);
      } else {
        enqueueSnackbar(response.data.EM);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      enqueueSnackbar(err.response.data.EM);
    } finally {
      fetchOrders();
    }
  };

  const handleUpdateStatusCanceled = async (orderId) => {
    try {
      // Gửi yêu cầu cập nhật trạng thái "Đã hủy"
      const response = await axios.put(`${api}/don-hang/${orderId}/canceled`);

      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" }); // Thông báo thành công
      } else {
        enqueueSnackbar(response.data.EM, { variant: "error" }); // Thông báo lỗi
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      enqueueSnackbar(err.response.data.EM, { variant: "error" }); // Thông báo lỗi
    } finally {
      fetchOrders();
    }
  };
  // Mở modal với Hỏi update
  const handleOpenDialog = (type, orderId) => {
    setActionType(type);
    setCurrentOrderId(orderId);
    setOpenDialog(true);
  };

  // Đóng modal
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActionType("");
    setCurrentOrderId(null);
  };

  // Hủy đơn hàng và đóng modal
  const handleCancelOrder = () => {
    if (currentOrderId) {
      handleUpdateStatusCanceled(currentOrderId);
    }
    handleCloseDialog();
  };

  // Xử lý khi xác nhận
  const handleConfirmAction = () => {
    if (actionType === "success" && currentOrderId) {
      handleUpdateStatusSuccess(currentOrderId);
    } else if (actionType === "canceled" && currentOrderId) {
      handleUpdateStatusCanceled(currentOrderId);
    }
    handleCloseDialog();
  };

  // Hàm mở modal và truyền ID đơn hàng vào
  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrderId(null);
  };
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage] = useState(8); // Number of items per page
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update current page
  };
  // Lấy dữ liệu đơn hàng theo trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem); // Cắt mảng đơn hàng theo trang
  return (
    <Container
      sx={{
        backgroundColor: currentTheme.backgroundColor,
        color: currentTheme.color,
        height: "100vh",
      }}
    >
      <Box sx={{ width: "100%", textAlign: "left", mt: 4, mb: 3 }}>
        <Typography variant="h5" color="primary">
          DANH SÁCH ĐƠN HÀNG ĐANG XỬ LÝ
        </Typography>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: currentTheme.backgroundColor,
          color: currentTheme.color,
          height: "100vh",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontSize: "0.875rem", color: currentTheme.colorTitle }}
              >
                <b>ID Đơn Hàng</b>
              </TableCell>
              <TableCell
                sx={{ fontSize: "0.875rem", color: currentTheme.colorTitle }}
              >
                <b>Người dùng</b>
              </TableCell>
              <TableCell
                sx={{ fontSize: "0.875rem", color: currentTheme.colorTitle }}
              >
                <b>Số điện thoại</b>
              </TableCell>
              <TableCell
                sx={{ fontSize: "0.875rem", color: currentTheme.colorTitle }}
              >
                <b>Tỉnh thành</b>
              </TableCell>
              <TableCell
                sx={{ fontSize: "0.875rem", color: currentTheme.colorTitle }}
              >
                <b>Tổng Tiền</b>
              </TableCell>
              <TableCell
                sx={{ fontSize: "0.875rem", color: currentTheme.colorTitle }}
              >
                <b>Trạng Thái</b>
              </TableCell>
              <TableCell
                sx={{ fontSize: "0.875rem", color: currentTheme.colorTitle }}
              >
                <b>Ngày Tạo</b>
              </TableCell>
              <TableCell
                sx={{ fontSize: "0.875rem", color: currentTheme.colorTitle }}
              >
                <b>Ngày Cập Nhật</b>
              </TableCell>
              <TableCell
                sx={{ fontSize: "0.875rem", color: currentTheme.colorTitle }}
              >
                <b>Chi Tiết</b>
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.875rem",
                  color: currentTheme.colorTitle,
                  textAlign: "center",
                }}
                colSpan={2} // Chỉ định rằng ô này sẽ chiếm 2 cột
              >
                <b>Hành động</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{ fontSize: "0.875rem", color: currentTheme.color }}
                >
                  {order.ID_ORDER || "Không xác định"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.875rem", color: currentTheme.color }}
                >
                  {(order.FIRSTNAME && order.LASTNAME) ? (order.FIRSTNAME + " " + order.LASTNAME) : "N/A"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.875rem", color: currentTheme.color }}
                >
                  {order.SHIPPING_PHONE || "Không xác định"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.875rem", color: currentTheme.color }}
                >
                  {order.SHIPPING_ADDRESS || "Không xác định"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.875rem", color: currentTheme.color }}
                >
                  {order.TOTALORDERPRICE
                    ? order.TOTALORDERPRICE.toLocaleString() + "đ"
                    : "N/A"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.875rem", color: currentTheme.color }}
                >
                  {order.STATUS ? order.STATUS : (order.ISDELETE ? "Đã hủy" : "Lỗi")}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.875rem", color: currentTheme.color }}
                >
                  {order.CREATEAT
                    ? moment(order.CREATEAT).format("DD/MM/YYYY HH:mm")
                    : "N/A"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.875rem", color: currentTheme.color }}
                >
                  {order.UPDATEAT
                    ? moment(order.UPDATEAT).format(
                      "DD/MM/YYYY HH:mm"
                    )
                    : "N/A"}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.875rem", color: currentTheme.colorTitle }}
                >
                  <Button
                    onClick={() => handleViewDetails(order.ID_ORDER)}
                    startIcon={
                      <VisibilityIcon sx={{ color: currentTheme.colorTitle }} />
                    }
                  ></Button>
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "#68d684" }}>
                  <Button
                    sx={{ color: "#68d684" }}
                    onClick={() => handleOpenDialog("success", order.ID_ORDER)}
                  >
                    Xác nhận
                  </Button>
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "red" }}>
                  <Button
                    sx={{ color: "red" }}
                    onClick={() => handleOpenDialog("canceled", order.ID_ORDER)}
                  >
                    Hủy
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <Pagination
        count={Math.ceil(orders.length / itemsPerPage)} // Tổng số trang
        page={currentPage}
        onChange={handlePageChange}
        sx={{
          marginTop: 4,
          display: "flex",
          justifyContent: "center",
          ".MuiPagination-ul": {
            borderRadius: "8px", // Bo góc
            padding: "4px 8px", // Khoảng cách bên trong
          },
          ".MuiPaginationItem-root": {
            color: "#c9d1d9", // Màu chữ đen
            fontWeight: "bold", // Chữ đậm
          },
          ".Mui-selected": {
            color: currentTheme.color, // Màu chữ trắng
          },
          ".MuiPaginationItem-ellipsis": {
            color: "#999999", // Màu cho dấu "..."
          },
        }}
      />

      {/* Modal hiển thị thông tin chi tiết */}
      {openModal && (
        <ProductDetailModal
          productId={selectedOrderId} // Truyền ID đơn hàng vào modal
          onClose={handleCloseModal} // Hàm đóng modal
        />
      )}{" "}

      {/* Modal xác nhận */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận hành động</DialogTitle>
        <DialogContent>
          {actionType === "success" ? (
            <p>
              Bạn có chắc chắn muốn đánh dấu đơn hàng này là "Đang giao"?
            </p>
          ) : (
            <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color="success"
          >
            Xác nhận gửi hàng
          </Button>
          <Button
            onClick={handleCancelOrder}
            variant="contained"
            color="error"
          >
            Hủy đơn
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TatCaDonHangAdminProcess;
