import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Drawer,
  IconButton,
  Box,
  Pagination,
  Tooltip,
  TextField,
  Chip,
  Autocomplete,
} from "@mui/material";
import {
  FilterList,
  AddShoppingCart,
  FavoriteBorder,
  Favorite as FavoriteIcon, // Thêm FavoriteIcon
} from "@mui/icons-material";
import axios from "axios";
import ProductCarousel from "../../share-view/productCarousel";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTotalCart } from "../../redux/authSlice";
import { enqueueSnackbar } from "notistack";

const api = process.env.REACT_APP_URL_SERVER;

const BrowseProduct = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [theLoai, setTheLoai] = useState([]);
  const [productStatus, setProductStatus] = useState([]); // Trạng thái sản phẩm (yêu thích và đã mua)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchProduct();
    fetchData();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${api}/api/v1/admin/sanpham/xem/use`);
      if (response.data.EC === 1) {
        setProducts(response.data.DT);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchData = async () => {
    try {
      const [responseTheLoai] = await Promise.all([
        axios.get(`${api}/api/v1/admin/theloai/xemtatca`),
      ]);
      if (responseTheLoai.data.EC === 1) {
        setTheLoai(responseTheLoai.data.DT);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Hàm kiểm tra trạng thái sản phẩm
  const fetchProductStatus = async () => {
    if (isAuthenticated && userInfo?.MA_KH && products.length > 0) {
      const productIds = products.map((item) => item.MASP);
      try {
        const response = await axios.post(
          `${api}/api/v1/yeuthich/check-product-status`,
          {
            userId: userInfo.MA_KH,
            productIds,
          }
        );
        if (response.data.EC === 1) {
          setProductStatus(response.data.data); // Lưu trạng thái sản phẩm
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái sản phẩm:", error);
      }
    }
  };

  useEffect(() => {
    fetchProductStatus();
  }, [isAuthenticated, userInfo, products]);

  const handleBuyProduct = (id) => {
    navigate(`/select-Game/${id}`);
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const payload = {
        ID_USER: userInfo?.ID_USER || userInfo[0].ID_USER,
        ID_PRODUCTDETAILS: product.ID_PRODUCTDETAILS,
      };
      const response = await axios.post(`${api}/api/v1/giohang/them`, payload);
      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        dispatch(setTotalCart(response.data.totalQuantity));
      } else {
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.EM || "Lỗi hệ thống", {
        variant: "error",
      });
    }
  };

  const handleAddToWish = async (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const payload = {
        MASP: product.MASP,
        MA_KH: userInfo.MA_KH,
      };
      const response = await axios.post(`${api}/api/v1/yeuthich/them`, payload);
      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        setProductStatus((prevStatus) =>
          prevStatus.map((status) =>
            status.MASP === product.MASP
              ? { ...status, favoriteStatus: true }
              : status
          )
        );
      } else {
        enqueueSnackbar(response.data.EM, { variant: "info" });
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.EM || "Lỗi hệ thống", {
        variant: "error",
      });
    }
  };

  const handleRemoveFromWish = async (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const payload = {
        MA_KH: userInfo.MA_KH,
        MASP: product.MASP,
      };
      const response = await axios.post(`${api}/api/v1/yeuthich/xoa`, payload);
      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        setProductStatus((prevStatus) =>
          prevStatus.map((status) =>
            status.MASP === product.MASP
              ? { ...status, favoriteStatus: false }
              : status
          )
        );
      } else {
        enqueueSnackbar(response.data.EM, { variant: "warning" });
      }
    } catch (error) {
      enqueueSnackbar("Lỗi khi xóa sản phẩm yêu thích", { variant: "error" });
    }
  };

  // Filter products
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategories(newValue);
  };

  useEffect(() => {
    const applyFilters = () => {
      let updatedProducts = products;
      if (searchQuery) {
        updatedProducts = updatedProducts.filter(
          (product) =>
            product.NAMEPRODUCT &&
            product.NAMEPRODUCT.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedCategories.length > 0) {
        updatedProducts = updatedProducts.filter((product) =>
          selectedCategories.some(
            (category) =>
              product.NAME_CATEGORY && product.NAME_CATEGORY.split(",").includes(category.NAME_CATEGORY)
          )
        );
      }
      setFilteredProducts(updatedProducts);
    };
    applyFilters();
  }, [searchQuery, selectedCategories, products]);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Box>
        <div>
          <ProductCarousel api={api} products={products} />
        </div>
        <div style={{ display: "flex" }}>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid
              item
              xs={12}
              sm={9}
              md={8}
              container
              spacing={2}
              sx={{ backgroundColor: "#262729" }}
            >
              {currentProducts.map((product, index) => {
                const status = productStatus.find(
                  (ps) => ps.ID_PRODUCT === product.ID_PRODUCT
                ) || {
                  favoriteStatus: false,
                  buyStatus: false,
                };
                const { favoriteStatus, buyStatus } = status;

                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        backgroundColor: "#282828",
                      }}
                      onClick={() => handleBuyProduct(product.ID_PRODUCT)}
                    >
                      <CardMedia
                        component="img"
                        image={`${api}/images/${product.GALLERYPRODUCT}`}
                        alt={product.GALLERYPRODUCT}
                        sx={{
                          height: {
                            xs: "210px",
                            sm: "210px",
                            md: "210px",
                            lg: "210px",
                          },
                          objectFit: "contain",
                          borderRadius: "15px",
                          transition: "filter 0.3s ease",
                          "&:hover": {
                            filter: "brightness(1.3)",
                          },
                        }}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.NAMEPRODUCT}
                        </Typography>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            fontSize: "15px",
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {/* Chưa có giá đúng====================================================================================== */}
                          {`${Number(product.PRICE_PRODUCTDETAILS).toLocaleString(
                            "vi-VN"
                          )}đ`}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#fff",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.NAME_CATEGORY}
                        </Typography>

                        <Tooltip title="Add to cart" arrow>
                          <IconButton
                            sx={{
                              cursor: "pointer",
                              mt: 2,
                              color: "#fff",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                color: "#555",
                                transform: "scale(1.2)",
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                          >
                            <AddShoppingCart />
                          </IconButton>
                        </Tooltip>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Grid
              item
              xs={12}
              sm={3}
              md={2}
              lg={2}
              display={{ xs: "none", sm: "block" }}
            >
              <Box>
                <TextField
                  label="Tìm kiếm sản phẩm"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  options={theLoai}
                  getOptionLabel={(option) => option.NAME_CATEGORY}
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={index}
                        label={option.NAME_CATEGORY}
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
            </Grid>

            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
              }}
            ></Drawer>
          </Grid>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={() => setMobileOpen(true)}
            sx={{
              display: { sm: "none" },
              position: "fixed",
              bottom: 16,
              right: 16,
            }}
          >
            <FilterList />
          </IconButton>
        </div>
        <Pagination
          count={Math.ceil(filteredProducts.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          sx={{
            marginTop: 4,
            display: "flex",
            justifyContent: "center",
            ".MuiPagination-ul": {
              borderRadius: "8px",
              padding: "4px 8px",
            },
            ".MuiPaginationItem-root": {
              color: "#c9d1d9",
              fontWeight: "bold",
            },
            ".Mui-selected": {
              color: "#ffffff",
            },
            ".MuiPaginationItem-ellipsis": {
              color: "#999999",
            },
          }}
        />
      </Box>
    </>
  );
};

export default BrowseProduct;
