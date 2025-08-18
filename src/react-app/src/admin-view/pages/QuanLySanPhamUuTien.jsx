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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { Add, Edit, Delete } from "@mui/icons-material";
const api = process.env.REACT_APP_URL_SERVER;

const QuanlySanphamUutien = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [productData, setProductData] = useState({
    MASP: "",
    GHI_CHU_UT: "",

    HINH_ANH_BIA: null,
    HINH_ANH_LOGO: null,
    HINH_ANH_NAVBAR: null,
  });
  const [allProducts, setAllProducts] = useState([]); // Lưu trữ danh sách sản phẩm
  const [page, setPage] = useState(0); // Trạng thái phân trang
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số hàng trên mỗi trang

  useEffect(() => {
    fetchProducts();
    fetchAllProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${api}/api/v1/admin/sanphamuutien/xemtatca`
      );
      if (response.data.EC === 1) {
        setProducts(response.data.DT);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${api}/api/v1/admin/sanpham/xemtatca`);
      if (response.data.EC === 1) {
        setAllProducts(response.data.DT); // Lưu danh sách sản phẩm vào state
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const handleClickOpen = () => {
    setProductData({
      MASP: "",
      GHI_CHU_UT: "",

      HINH_ANH_BIA: null,
      HINH_ANH_LOGO: null,
      HINH_ANH_NAVBAR: null,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProductData({
      MASP: "",
      GHI_CHU_UT: "",

      HINH_ANH_BIA: null,
      HINH_ANH_LOGO: null,
      HINH_ANH_NAVBAR: null,
    });
  };

  const handleSaveProduct = async () => {
    try {
      const formData = new FormData();
      // Thêm các trường dữ liệu vào FormData
      formData.append("MASP", productData.MASP);
      formData.append("GHI_CHU_UT", productData.GHI_CHU_UT);

      // Thêm hình ảnh nếu có
      if (productData.HINH_ANH_BIA) {
        formData.append("HINH_ANH_BIA", productData.HINH_ANH_BIA);
      }
      if (productData.HINH_ANH_LOGO) {
        formData.append("HINH_ANH_LOGO", productData.HINH_ANH_LOGO);
      }
      if (productData.HINH_ANH_NAVBAR) {
        formData.append("HINH_ANH_NAVBAR", productData.HINH_ANH_NAVBAR);
      }
      console.log("formData:", formData);
      console.log("productData:", productData);
      let response;
      if (productData.MASANPHAMUUTIEN) {
        // Nếu đã có MA_SANPHAM_UUTIEN, thực hiện cập nhật
        response = await axios.put(
          `${api}/api/v1/admin/sanphamuutien/sua/${productData.MASANPHAMUUTIEN}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Nếu chưa có MA_SANPHAM_UUTIEN, thực hiện thêm mới
        response = await axios.post(
          `${api}/api/v1/admin/sanphamuutien/tao`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      if (response.data.EC === 1) {
        // Nếu thêm mới hoặc cập nhật thành công, reset dữ liệu
        setProductData({
          MASP: "",
          GHI_CHU_UT: "",

          HINH_ANH_BIA: null,
          HINH_ANH_LOGO: null,
          HINH_ANH_NAVBAR: null,
        });
        // setOpen(false); // Đóng cửa sổ popup
        fetchProducts(); // Lấy lại danh sách sản phẩm
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEditProduct = async (product) => {
    setProductData(product);
    setOpen(true);
  };

  const handleDeleteProduct = async (MASANPHAMUUTIEN) => {
    try {
      const response = await axios.delete(
        `${api}/api/v1/admin/sanphamuutien/xoa/${MASANPHAMUUTIEN}`
      );
      if (response.data.EC === 1) {
        fetchProducts(); // Lấy lại danh sách sản phẩm ưu tiên sau khi xóa
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    console.log("New Page: ", newPage); // Kiểm tra trang mới
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log("Rows Per Page: ", event.target.value); // Kiểm tra số sản phẩm mỗi trang
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset lại trang khi thay đổi số sản phẩm mỗi trang
  };

  const paginatedProducts = products.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setProductData({
      ...productData,
      [field]: file, // Lưu trữ hình ảnh vào đối tượng sản phẩm
    });
  };

  return (
    <Container>
      <Box sx={{ width: "100%", textAlign: "left", mt: 4 }}>
        <Typography
          variant="h5"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          QUẢN LÝ SẢN PHẨM ƯU TIÊN
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
          Thêm mới sản phẩm ưu tiên
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: "#101014" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#c9d1d9" }}>
                Mã sản phẩm ưu tiên
              </TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Đơn giá</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Nhà sản xuất</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Thể loại</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Ảnh Bìa</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Hình logo</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Hình navabr</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.MASANPHAMUUTIEN}>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {product.MASANPHAMUUTIEN}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>{product.TENSP}</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {product.DON_GIA ? product.DON_GIA.toLocaleString() : "N/A"}₫
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {product.NHA_SAN_XUAT}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>{product.TENTL}</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  <img
                    src={`${api}/images/${product.HINH_ANH_BIA}`}
                    alt={product.HINH_ANH_BIA}
                    width="100"
                  />
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  <img
                    src={`${api}/images/${product.HINH_ANH_LOGO}`}
                    alt={product.HINH_ANH_LOGO}
                    width="100"
                  />
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {" "}
                  <img
                    src={`${api}/images/${product.HINH_ANH_NAVBAR}`}
                    alt={product.HINH_ANH_NAVBAR}
                    width="100"
                  />
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {/* <IconButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit />
                  </IconButton> */}
                  <IconButton
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteProduct(product.MASANPHAMUUTIEN)}
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
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "#c9d1d9" }}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {productData.MA_SANPHAM_UUTIEN
            ? "Chỉnh sửa sản phẩm ưu tiên"
            : "Thêm mới sản phẩm ưu tiên"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" margin="dense">
            <Autocomplete
              id="select-product"
              value={
                allProducts.find(
                  (product) => product.MASP === productData.MASP
                ) || null
              } // Chọn giá trị phù hợp với MASP hiện tại
              onChange={(e, newValue) => {
                setProductData({
                  ...productData,
                  MASP: newValue ? newValue.MASP : "", // Cập nhật MASP khi chọn một sản phẩm
                });
              }}
              options={allProducts} // Dữ liệu sản phẩm
              getOptionLabel={(option) => option.TENSP} // Hiển thị tên sản phẩm
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn game cần ưu tiên"
                  variant="outlined"
                  margin="dense"
                />
              )}
            />
          </FormControl>
          <TextField
            margin="dense"
            label="Ghi chú"
            type="text"
            fullWidth
            variant="outlined"
            value={productData.GHI_CHU_UT}
            onChange={(e) =>
              setProductData({
                ...productData,
                GHI_CHU_UT: e.target.value,
              })
            }
            InputLabelProps={{
              shrink: true, // Đảm bảo label luôn thu nhỏ
            }}
          />

          {/* Các input hình ảnh */}
          <TextField
            margin="dense"
            label="Hình ảnh bìa"
            type="file"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true, // Đảm bảo label luôn thu nhỏ
            }}
            onChange={(e) => handleFileChange(e, "HINH_ANH_BIA")}
          />

          <TextField
            margin="dense"
            label="Hình ảnh logo"
            type="file"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => handleFileChange(e, "HINH_ANH_LOGO")}
          />

          <TextField
            margin="dense"
            label="Hình ảnh navbar"
            type="file"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => handleFileChange(e, "HINH_ANH_NAVBAR")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveProduct} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuanlySanphamUutien;
