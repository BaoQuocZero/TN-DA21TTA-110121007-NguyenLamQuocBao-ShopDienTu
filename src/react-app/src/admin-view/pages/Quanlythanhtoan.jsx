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
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { Add, Edit, Delete } from "@mui/icons-material";
const api = process.env.REACT_APP_URL_SERVER;

const QuanlythanhToan = () => {
  const [payments, setPayments] = useState([]);
  const [open, setOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    CACH_THANH_TOAN: "",
    GHI_CHU_THANH_TOAN: "",
  });

  const [page, setPage] = useState(0); // Trạng thái phân trang
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số hàng trên mỗi trang

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${api}/api/v1/admin/thanhtoan/xemtatca`
      );
      if (response.data.EC === 1) {
        setPayments(response.data.DT);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = () => {
    setPaymentData({
      CACH_THANH_TOAN: "",
      GHI_CHU_THANH_TOAN: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPaymentData({
      CACH_THANH_TOAN: "",
      GHI_CHU_THANH_TOAN: "",
    });
  };

  const handleSavePayment = async () => {
    try {
      let response;
      if (paymentData.MA_THANH_TOAN) {
        // Nếu đã có MA_THANH_TOAN, thực hiện cập nhật
        response = await axios.put(
          `${api}/api/v1/admin/thanhtoan/sua/${paymentData.MA_THANH_TOAN}`,
          paymentData
        );

        if (response.data.EC === 1) {
          setPaymentData({
            CACH_THANH_TOAN: "",
            GHI_CHU_THANH_TOAN: "",
          });
        }
      } else {
        // Nếu chưa có MA_THANH_TOAN, thực hiện thêm mới
        response = await axios.post(
          `${api}/api/v1/admin/thanhtoan/tao`,
          paymentData
        );
      }
      if (response.data.EC === 1) {
        fetchPayments(); // Lấy lại danh sách thanh toán sau khi thêm mới hoặc cập nhật
        setOpen(false); // Đóng cửa sổ popup
      }
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const handleEditPayment = async (MA_THANH_TOAN) => {
    try {
      const response = await axios.post(`${api}/api/v1/admin/thanhtoan/xemid`, {
        MA_THANH_TOAN,
      });
      if (response.data.EC === 1) {
        setPaymentData(response.data.DT[0]);
        setOpen(true); // Mở popup để chỉnh sửa
      }
    } catch (error) {
      console.error("Error editing payment:", error);
    }
  };

  const handleDeletePayment = async (MA_THANH_TOAN) => {
    try {
      const response = await axios.delete(
        `${api}/api/v1/admin/thanhtoan/xoa/${MA_THANH_TOAN}`
      );
      if (response.data.EC === 1) {
        fetchPayments(); // Lấy lại danh sách thanh toán sau khi xóa
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const paginatedPayments = payments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container>
      <Box sx={{ width: "100%", textAlign: "left", mt: 4 }}>
        <Typography
          variant="h5"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          QUẢN LÝ THANH TOÁN
        </Typography>
        <Button
          variant="contained"
          onClick={handleClickOpen}
          sx={{
            marginBottom: 2,
            backgroundColor: "#fff",
            color: "black",
          }}
        >
          Thêm mới thanh toán
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: "#101014" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#c9d1d9" }}>Mã thanh toán</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Cách thanh toán</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Ghi chú</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Ngày tạo</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPayments.map((payment) => (
              <TableRow key={payment.MA_THANH_TOAN}>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {payment.MA_THANH_TOAN}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {payment.CACH_THANH_TOAN}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {payment.GHI_CHU_THANH_TOAN}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {payment.CREATED_AT}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  <IconButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditPayment(payment.MA_THANH_TOAN)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeletePayment(payment.MA_THANH_TOAN)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={payments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "#c9d1d9" }}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {paymentData.MA_THANH_TOAN
            ? "Chỉnh sửa thanh toán"
            : "Thêm mới thanh toán"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cách thanh toán"
            type="text"
            fullWidth
            variant="outlined"
            value={paymentData.CACH_THANH_TOAN}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                CACH_THANH_TOAN: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Ghi chú"
            type="text"
            fullWidth
            variant="outlined"
            value={paymentData.GHI_CHU_THANH_TOAN}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                GHI_CHU_THANH_TOAN: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSavePayment} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuanlythanhToan;
