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
import { enqueueSnackbar } from "notistack";
import moment from "moment";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const api = process.env.REACT_APP_URL_SERVER;

const Quanlytheloai = () => {
  const [theloai, setTheloai] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);

  const [currentCategory, setCurrentCategory] = useState(null);

  const [tenTheloai, setTenTheloai] = useState("");
  const [PARENTID, setPARENTID] = useState("");
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
      category.NAME_CATEGORY.toLowerCase().includes(searchTerm.toLowerCase())
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
    setTenTheloai(category ? category.NAME_CATEGORY : "");
    setPARENTID(category ? category.PARENTID : "");
    setMoTaTheloai(category ? category.DESCRIPTION : "");
    setTrangThaiTheloai(category ? category.ISDELETE : 1);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTenTheloai("");
    setCurrentCategory(null);
  };

  const handleOpenDeleteDialog = (category) => {
    setSelectedCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedCategoryToDelete(null);
  };

  const handleSave = async () => {
    const categoryData = {
      NAME: tenTheloai,
      PARENTID: PARENTID,
      DESCRIPTION: moTaTheloai,
      ISDELETE: trangThaiTheloai,
    };
    try {
      if (currentCategory) {
        console.log("currentCategory:", currentCategory)
        const response = await axios.put(
          `${api}/api/v1/admin/theloai/sua/${currentCategory.ID_CATEGORY}`,
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

  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`${api}/api/v1/admin/theloai/xoa`, {
  //       data: { ID_CATEGORY: id },
  //     });
  //     fetchCategories();
  //   } catch (error) {
  //     console.error("Error deleting category:", error);
  //   }
  // };

  const confirmDeleteCategory = async () => {
    try {
      const response = await axios.delete(`${api}/api/v1/admin/theloai/xoa`, {
        data: { ID_CATEGORY: selectedCategoryToDelete.ID_CATEGORY },
      });

      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "warning" });
        fetchCategories(); // Cập nhật lại danh sách
      }

      if (response.data.EC === 0) {
        enqueueSnackbar(response.data.EM, { variant: "warning" });
      }

    } catch (error) {
      console.error("Lỗi xóa thể loại:", error);
    } finally {
      handleCloseDeleteDialog();
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
              <TableRow key={category.ID_CATEGORY}>
                <TableCell sx={{ color: "#c9d1d9" }}>{category.ID_CATEGORY}</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {category.NAME_CATEGORY}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {category.DESCRIPTION}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {moment(category.CREATEDAT).format("HH:mm:ss - DD/MM/YYYY")}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {moment(category.UPDATEDAT).format("HH:mm:ss - DD/MM/YYYY")}
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
                    onClick={() => handleOpenDeleteDialog(category)}
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
            label="Thể loại cha"
            type="text"
            fullWidth
            variant="outlined"
            value={PARENTID}
            onChange={(e) => setPARENTID(e.target.value)}
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
            <MenuItem value={0}>Đang sử dụng</MenuItem>
            <MenuItem value={1}>Ngưng sử dụng</MenuItem>
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

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Xác nhận xoá thể loại</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Bạn có chắc chắn muốn xoá <strong>{selectedCategoryToDelete?.NAME_CATEGORY}</strong> vĩnh viễn không?
          </Typography>

          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            ⚠️ Lưu ý: Thể loại <strong>không thể xoá</strong> nếu:
          </Typography>
          <ul style={{ marginTop: 8, paddingLeft: 24, color: "#fdd835" }}>
            <li>Đang có <strong>sản phẩm</strong> liên kết với thể loại này.</li>
            <li>Đang được sử dụng làm <strong>danh mục cha</strong> của thể loại khác.</li>
          </ul>

          <Typography sx={{ mt: 1 }} color="error">
            Hành động này <strong>không thể hoàn tác</strong> nếu xoá thành công.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Hủy
          </Button>
          <Button onClick={confirmDeleteCategory} color="error" variant="contained">
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Quanlytheloai;
