import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Autocomplete,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import ProductModal from "../ModalService/ProductModal";

const ProductManagement = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${api}/api/v1/admin/sanpham/xemtatca`);
      const response_category = await axios.get(
        `${api}/api/v1/admin/theloai/xemtatca`
      );
      setProducts(response.data.DT);
      setCategories(response_category.data.DT);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await axios.delete(`${api}/api/v1/admin/sanpham/xoa/${product.MASP}`);
        console.log("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Logic lọc sản phẩm
  const filteredProducts = products.filter((product) => {
    // Lọc theo từ khóa tìm kiếm (TENSP)
    const matchesSearchQuery =
      searchQuery.trim() === "" ||
      (product.TENSP &&
        product.TENSP.toLowerCase().includes(searchQuery.toLowerCase()));

    // Lọc theo thể loại (TENTL)
    const productCategories = product.TENTL ? product.TENTL.split(",") : [];
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((category) =>
        productCategories.includes(category.TENTL)
      );

    // Sản phẩm phải khớp cả hai điều kiện
    return matchesSearchQuery && matchesCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategories(newValue);
    setPage(0);
  };

  return (
    <Container>
      <Box sx={{ width: "100%", textAlign: "left", mt: 4 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Quản lý Sản phẩm
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            marginBottom: 2,
            backgroundColor: "#fff",
            color: "black",
          }}
        >
          Thêm Sản phẩm
        </Button>
      </Box>
      <Box sx={{ display: "flex" }}>
        <TextField
          label="Tìm kiếm sản phẩm"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          sx={{
            marginBottom: 2,
            backgroundColor: "#202024",
            color: "#ffffff",
            width: "400px",
            "& .MuiInputLabel-root": { color: "#ffffff" },
            "& .MuiOutlinedInput-input": { color: "#ffffff" },
          }}
        />
        <Autocomplete
          multiple
          options={categories}
          getOptionLabel={(option) => option.TENTL}
          value={selectedCategories}
          onChange={handleCategoryChange}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                key={index}
                label={option.TENTL}
                {...getTagProps({ index })}
                sx={{
                  backgroundColor: "#3ccaff",
                  color: "#121212",
                  margin: "2px",
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tìm kiếm thể loại"
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-input": { color: "#ffffff" },
                width: "400px",
                ml: 2,
                input: { color: "#121212" },
                label: { color: "#ffffff" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#202024",
                },
              }}
            />
          )}
        />
      </Box>
      <TableContainer component={Paper} sx={{ backgroundColor: "#101014" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#c9d1d9" }}>Mã SP</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Tên SP</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Tên thể loại</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Đơn Giá</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Nhà SX</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Ảnh SP</TableCell>
              <TableCell sx={{ color: "#c9d1d9" }}>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.ID_PRODUCTDETAILS}>
                <TableCell sx={{ color: "#c9d1d9" }}>{product.ID_PRODUCTDETAILS}</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>{product.NAME_PRODUCTDETAILS}</TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {product.NAME_CATEGORY || "N/A"}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {product.PRICE_PRODUCTDETAILS ? product.PRICE_PRODUCTDETAILS.toLocaleString() : "N/A"}₫
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  {product.BRAND_NAME || "N/A"}
                </TableCell>
                <TableCell sx={{ color: "#c9d1d9" }}>
                  <img
                    src={`http://localhost:8081/images/${product.GALLERYPRODUCT_DETAILS}`}
                    alt={product.TENSP}
                    width="100"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(product)}
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
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "#c9d1d9" }}
      />

      <ProductModal
        product={selectedProduct}
        fetchProducts={fetchProducts}
        onDelete={handleDelete}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Container>
  );
};

export default ProductManagement;
