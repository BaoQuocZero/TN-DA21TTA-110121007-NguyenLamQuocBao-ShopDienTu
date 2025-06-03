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
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import moment from "moment";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const api = process.env.REACT_APP_URL_SERVER;

const Quanlytheloai = () => {
  const [theloai, setTheloai] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [tenTheloai, setTenTheloai] = useState("");
  const [moTaTheloai, setMoTaTheloai] = useState("");
  const [trangThaiTheloai, setTrangThaiTheloai] = useState(1);

  const [filteredTheloai, setFilteredTheloai] = useState([]); // Dữ liệu sau khi lọc
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị tìm kiếm

  const [page, setPage] = useState(0); // Trạng thái phân trang
  const [rowsPerPage, setRowsPerPage] = useState(7); // Số hàng trên mỗi trang

  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchCategories();
  }, [tenTheloai]);

  useEffect(() => {
    const filtered = theloai.filter((category) =>
      category.TENTL.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTheloai(filtered);
  }, [searchTerm, theloai]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/api/v1/admin/theloai/xemtatca`, {
        params: {
          page: page + 1, // page được gửi từ 1
          limit: rowsPerPage,
        },
      });
      if (response.data.EC === 1) {
        setTheloai(response.data.DT);
        setFilteredTheloai(response.data.DT); // Cập nhật dữ liệu lọc
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOpenDialog = (category = null) => {
    setCurrentCategory(category);
    setTenTheloai(category ? category.TENTL : "");
    setMoTaTheloai(category ? category.MO_TA_TL : "");
    setTrangThaiTheloai(category ? category.TRANG_THAI_THELOAI : 1);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTenTheloai("");
    setCurrentCategory(null);
  };

  const handleSave = async () => {
    const categoryData = {
      TENTL: tenTheloai,
      MO_TA_TL: moTaTheloai,
      TRANG_THAI_THELOAI: trangThaiTheloai,
    };
    try {
      if (currentCategory) {
        const response = await axios.put(
          `${api}/api/v1/admin/theloai/sua/${currentCategory.MATL}`,
          categoryData
        );
        if (response.data.EC === 1) {
          fetchCategories();
        }
      } else {
        const response = await axios.post(
          `${api}/api/v1/admin/theloai/tao`,
          categoryData
        );
        if (response.data.EC === 1) {
          fetchCategories();
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/api/v1/admin/theloai/xoa`, {
        data: { MATL: id },
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const paginatedtheloai = filteredTheloai.slice(
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
          QUẢN LÝ THỂ LOẠI
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
          Thêm thể loại
        </Button>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm theo tên thể loại..."
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white', // Màu chữ
              borderColor: 'white', // Màu viền
              '& fieldset': {
                borderColor: 'white', // Màu viền khi chưa hover
              },
              '&:hover fieldset': {
                borderColor: 'white', // Màu viền khi hover
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white', // Màu viền khi focus
              },
            },
            '& .MuiInputBase-input': {
              color: 'white', // Màu chữ bên trong ô input
            },
            '& .MuiInputLabel-root': {
              color: 'white', // Màu chữ của label (nếu có)
            },
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: "#101014" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#c9d1d9" }}>ID</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Tên thể loại</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Mô tả</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Ngày tạo</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Ngày cập nhật</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedtheloai.map((category) => (
              <TableRow key={category.MATL}>
                <TableCell sx={{ color: "#c9d1d9" }}>{category.MATL}</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {category.TENTL}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {category.MO_TA_TL}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {moment(category.CREATED_AT).format("HH:mm:ss - DD/MM/YYYY")}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {moment(category.UPDATED_AT).format("HH:mm:ss - DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(category)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(category.MATL)}
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
        count={filteredTheloai.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "#c9d1d9" }}
      />

      {/* Dialog for Adding/Editing Category */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentCategory ? "Sửa Thể Loại" : "Thêm Thể Loại"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên thể loại"
            type="text"
            fullWidth
            variant="outlined"
            value={tenTheloai}
            onChange={(e) => setTenTheloai(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mô tả thể loại"
            type="text"
            fullWidth
            variant="outlined"
            value={moTaTheloai}
            onChange={(e) => setMoTaTheloai(e.target.value)}
          />
          <Select
            margin="dense"
            label="Trạng Thái"
            fullWidth
            variant="outlined"
            value={trangThaiTheloai}
            onChange={(e) => setTrangThaiTheloai(e.target.value)}
          >
            <MenuItem value={1}>Đang sử dụng</MenuItem>
            <MenuItem value={0}>Ngưng sử dụng</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary">
            {currentCategory ? "Sửa" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Quanlytheloai;
