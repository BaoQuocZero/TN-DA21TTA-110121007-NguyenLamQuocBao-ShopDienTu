import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTotalCart } from "../redux/authSlice";
import translations from "../redux/data/translations";

const api = process.env.REACT_APP_URL_SERVER;
const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isFixed, setIsFixed] = useState(false); // State để điều khiển vị trí
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //language
  const language = useSelector((state) => state.language.language);
  const t = translations[language].navbar;

  const isActive = (path) => location.pathname === path;

  const { isAuthenticated, userInfo, totalCart } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchTotalCart();
    }
  }, [userInfo, dispatch]);

  const fetchTotalCart = async () => {
    try {
      const response = await axios.get(
        `${api}/gio-hang/total-quantity/${userInfo.ID_NGUOI_DUNG}`
      );
      if (response.data.EC === 1) {
        dispatch(setTotalCart(response.data.DT));
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleBuyProduct = (id) => {
    console.log("handleBuyProduct: ", id)
    setSearchTerm("");
    setProducts([]);
    navigate(`/select-game/${id}`);
  };
  const menuItems = (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        {/* Left-aligned items */}
        <Box sx={{ display: "flex" }}>
          <Box component={RouterLink} to="/" sx={{ textDecoration: "none" }}>
            <Typography
              variant="body1"
              component="div"
              sx={{
                mx: 2,
                cursor: "pointer",
                color: isActive("/") ? "#3ccaff" : "#fff",
              }}
            >
              Khám Phá
            </Typography>
          </Box>

          <Box
            component={RouterLink}
            to="/browser"
            sx={{ textDecoration: "none" }}
          >
            <Typography
              variant="body1"
              component="div"
              sx={{
                mx: 2,
                cursor: "pointer",
                color: isActive("/browser") ? "#3ccaff" : "#fff",
              }}
            >
              Sản Phẩm
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box
            component={RouterLink}
            to="/cart"
            sx={{ textDecoration: "none" }}
          >
            <Typography
              variant="body1"
              component="div"
              sx={{
                mx: 2,
                cursor: "pointer",
                color: isActive("/cart") ? "#3ccaff" : "#fff",
              }}
            >
              <Badge badgeContent={totalCart} color="secondary">
                Giỏ hàng
              </Badge>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );

  useEffect(() => {
    const handleScroll = () => {
      // Kiểm tra vị trí cuộn
      if (window.scrollY > 50) {
        // Thay đổi giá trị 50 nếu cần thiết
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const searchBoxRef = useRef(null); // Ref để tham chiếu tới hộp kết quả

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Gửi yêu cầu tìm kiếm khi người dùng nhập từ khóa
    if (term.length >= 1) {
      // Chỉ tìm kiếm khi có ít nhất 3 ký tự
      try {
        const response = await axios.get(
          `${api}/api/v1/admin/sanpham/search/name`,
          {
            params: { query: term },
          }
        );
        if (response.data.EC === 1) {
          setProducts(response.data.DT);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    } else {
      setProducts([]);
    }
  }; // Xử lý sự kiện click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setSearchTerm(""); // Đặt lại input nếu click bên ngoài
        setProducts([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <AppBar
      position={isFixed ? "fixed" : "relative"} // Thay đổi vị trí dựa trên trạng thái
      style={{
        backgroundColor: "#101014",
        transition: "top 0.3s",
        top: isFixed ? 0 : "auto",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#101014",
            borderRadius: 50,
            padding: "4px 12px",
            marginRight: 16,
            width: "300px",
            position: "relative", // Đảm bảo phần tử con có thể được căn chỉnh chính xác
          }}
        >
          <IconButton size="small" color="inherit">
            <SearchIcon />
          </IconButton>
          <InputBase
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={"Tìm kiếm sản phẩm"}
            sx={{
              ml: 1,
              color: "inherit",
              flex: 1,
              position: "relative", // Giữ cho input có thể căn chỉnh đúng với kết quả tìm kiếm
            }}
            inputProps={{ "aria-label": "search store" }}
          />

          {/* Hiển thị kết quả tìm kiếm */}
          <Box
            ref={searchBoxRef} // ✅ để ngoài, bao hết results
            sx={{
              marginTop: "20px",
              top: 20,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              position: "absolute",
              zIndex: 100,
              width: "100%",
            }}
          >
            {products.length > 0 &&
              products.map((product) => (
                <Box
                  key={product.ID_PRODUCT}
                  onClick={() => handleBuyProduct(product.ID_PRODUCT)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: 2,
                    boxShadow: 2,
                    padding: 1,
                    cursor: "pointer",   // ✅ thêm cursor để rõ ràng
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "left" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#101014",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      {product.NAME_PRODUCTDETAILS}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "gray", fontSize: "10px" }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.PRICE_PRODUCTDETAILS)}
                    </Typography>
                  </Box>
                  <img
                    src={`${api}/images/${product.GALLERYPRODUCT_DETAILS}`}
                    alt={product.GALLERYPRODUCT_DETAILS}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginRight: 16,
                    }}
                  />
                </Box>
              ))}
          </Box>
        </Box>

        {/* {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open menu"
              onClick={handleMenuOpen}
              sx={{ ml: "auto" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>{t.Discover}</MenuItem>
              <MenuItem onClick={handleMenuClose}>Browse</MenuItem>
              <MenuItem onClick={handleMenuClose}>News</MenuItem>
              <MenuItem onClick={handleMenuClose}>Wishlist</MenuItem>
              <MenuItem onClick={handleMenuClose}>Cart</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            {menuItems}
            <Box sx={{ flexGrow: 1 }} />
          </>
        )} */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
