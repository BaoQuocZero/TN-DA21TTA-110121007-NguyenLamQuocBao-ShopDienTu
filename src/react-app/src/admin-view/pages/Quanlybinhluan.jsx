import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  MenuItem,
  Select,
  TablePagination,
} from "@mui/material";

import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const api = process.env.REACT_APP_URL_SERVER;

const BinhLuanManager = () => {
  const [comments, setComments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [noiDung, setNoiDung] = useState("");
  const [nguoiDungId, setNguoiDungId] = useState("");
  const [sanPhamId, setSanPhamId] = useState("");
  const [danhgia, setDanhgia] = useState("");
  const [page, setPage] = useState(0); // Trạng thái phân trang
  const [rowsPerPage, setRowsPerPage] = useState(7); // Số hàng trên mỗi trang
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${api}/api/v1/admin/binhluan/xemtatca`);
      if (response.data.EC === 1) {
        setComments(response.data.DT);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bình luận:", error);
    }
  };

  const handleOpenDialog = (comment = null) => {
    setCurrentComment(comment);
    setNoiDung(comment ? comment.NOI_DUNG_BINH_LUAN : "");
    setNguoiDungId(comment ? comment.MA_KH : "");
    setSanPhamId(comment ? comment.MASP : "");
    setDanhgia(comment ? comment.DANH_GIA : "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNoiDung("");
    setNguoiDungId("");
    setSanPhamId("");
    setDanhgia("");
    setCurrentComment(null);
  };

  const handleSave = async () => {
    const commentData = {
      NOI_DUNG_BINH_LUAN: noiDung,
      MA_KH: nguoiDungId,
      MASP: sanPhamId,
      DANH_GIA: danhgia,
    };

    console.log(commentData);
    try {
      if (currentComment) {
        // Update comment
        const response = await axios.put(
          `${api}/api/v1/admin/binhluan/sua/${currentComment.MA_BL}`,
          commentData
        );
        if (response.data.EC === 1) {
          fetchComments();
        }
      } else {
        // Add new comment
        const response = await axios.post(
          `${api}/api/v1/admin/binhluan/tao`,
          commentData
        );
        if (response.data.EC === 1) {
          fetchComments();
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi lưu bình luận:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/api/v1/admin/binhluan/xoa/${id}`);
      fetchComments();
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedcomments = comments.slice(
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
          Quản Lý Bình Luận
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            marginBottom: 2,
            backgroundColor: "#fff",
            color: "black",
            textAlign: "left",
          }}
        >
          Thêm bình luận
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: "#101014" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#c9d1d9" }}>ID</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Người dùng</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Sản phẩm</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Nội dung</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Đánh giá</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedcomments.map((comment) => (
              <TableRow key={comment.MA_BL}>
                <TableCell sx={{ color: "#c9d1d9" }}>{comment.MA_BL}</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {comment.TEN_KHACH_HANG}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>{comment.TENSP}</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {comment.NOI_DUNG_BINH_LUAN}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {comment.DANH_GIA}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(comment)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(comment.MA_BL)}
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
        count={comments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "#c9d1d9" }}
      />

      {/* Dialog for Adding/Editing Comment */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentComment ? "Sửa Bình Luận" : "Thêm Bình Luận"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nội dung"
            type="text"
            fullWidth
            variant="outlined"
            value={noiDung}
            onChange={(e) => setNoiDung(e.target.value)}
          />
          <TextField
            margin="dense"
            label="ID Người dùng"
            type="text"
            fullWidth
            variant="outlined"
            value={nguoiDungId}
            onChange={(e) => setNguoiDungId(e.target.value)}
          />
          <TextField
            margin="dense"
            label="ID Sản phẩm"
            type="text"
            fullWidth
            variant="outlined"
            value={sanPhamId}
            onChange={(e) => setSanPhamId(e.target.value)}
          />
          <Select
            margin="dense"
            label="Đánh giá"
            fullWidth
            variant="outlined"
            value={danhgia}
            onChange={(e) => setDanhgia(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <MenuItem key={rating} value={rating}>
                {rating}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary">
            {currentComment ? "Sửa" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BinhLuanManager;
