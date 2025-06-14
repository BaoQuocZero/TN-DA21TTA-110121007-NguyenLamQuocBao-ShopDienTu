import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "./css/carouselHead.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import translations from "../redux/data/translations";
import { useDispatch, useSelector } from "react-redux";
import { setTotalCart } from "../redux/authSlice";
import { enqueueSnackbar } from "notistack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getThemeConfig } from "../service/themeService";

const api = process.env.REACT_APP_URL_SERVER;

const CarouselHead = ({ carouselProducts }) => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isSelected, setIsSelected] = useState(""); // State để theo dõi trạng thái nhấp
  const [animateLogo, setAnimateLogo] = useState(false); // State để quản lý animation logo
  const language = useSelector((state) => state.language.language);
  const t = translations[language].homeCarouselHead;
  const navigate = useNavigate();
  // State to manage the current main image
  const [mainImage, setMainImage] = useState("");
  const dispatch = useDispatch();

  const currentTheme = getThemeConfig(
    localStorage.getItem("THEMES") || userInfo?.THEMES || "dark"
  );

  useEffect(() => {
    if (carouselProducts && carouselProducts.length > 0) {
      setMainImage(carouselProducts[0].GALLERYPRODUCT_DETAILS);
    }
  }, [carouselProducts]);

  const handleClick = (product, index) => {
    setIsSelected(index); // Đảo ngược trạng thái khi nhấp
    setMainImage(product.GALLERYPRODUCT_DETAILS); // Cập nhật hình ảnh chính

    setAnimateLogo(true);

    setTimeout(() => {
      setAnimateLogo(false);
    }, 500);
  };
  const selectedProduct = carouselProducts.find(
    (product) => product.GALLERYPRODUCT_DETAILS === mainImage
  );

  const handleBuyProduct = (id) => {
    navigate(`/select-game/${id}`);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Nếu chưa, chuyển hướng đến trang đăng nhập
      navigate("/login"); // Đảm bảo '/login' là đường dẫn đúng tới trang đăng nhập của bạn
      return; // Dừng hàm nếu chưa đăng nhập
    }
    console.log("userInfo", userInfo);
    try {
      const payload = {
        MASP: selectedProduct.MASP,
        MANGUOIDUNG: userInfo.MA_KH, // ID người dùng
        NGAY_CAP_NHAT_GIOHANG: new Date().toISOString(),
      };

      const response = await axios.post(`${api}/api/v1/giohang/them`, payload);

      if (response.data.EC === 1) {
        dispatch(setTotalCart(response.data.totalQuantity));

        enqueueSnackbar(response.data.EM, { variant: "success" });
      } else {
        console.log("Lỗi:", response.data.EM); // Xử lý lỗi nếu có
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
      enqueueSnackbar(error.response.data.EM, { variant: "error" });
    }
  };

  return (
    <>
      {carouselProducts.length > 0 ? (
        <>
          {" "}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              backgroundColor: currentTheme.backgroundColor,
              color: "#fff",
              minHeight: "100vh",
              width: "100%",
              mt: 4,
            }}
          >
            <Box
              className="main-image-container"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                width: "100%",
                backgroundColor: currentTheme.backgroundColor,
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${selectedProduct
                  ? `${api}/images/${selectedProduct.GALLERYPRODUCT_DETAILS}`
                  : "default-image-path"
                  })`,
                backgroundSize: "cover", // Để ảnh phủ toàn bộ
                backgroundPosition: "center", // Căn giữa ảnh nền
              }}
            >
              <Box
                sx={{
                  flex: 1, // Chiếm 50% chiều rộng
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end", // Căn dưới cùng theo chiều dọc
                  alignItems: "flex-start", // Căn bên trái theo chiều ngang
                  padding: 4,
                  color: "#f50057",
                }}
              >
                {selectedProduct && (
                  <img
                    src={
                      selectedProduct.GALLERYPRODUCT_DETAILS
                        ? `${api}/images/${selectedProduct.GALLERYPRODUCT_DETAILS}`
                        : "default-image-path" // Thay thế bằng đường dẫn ảnh mặc định nếu không tìm thấy
                    }
                    alt={`${selectedProduct.GALLERYPRODUCT_DETAILS
                      ? selectedProduct.GALLERYPRODUCT_DETAILS
                      : "Product"
                      } Logo`}
                    className={`${animateLogo ? "slide-in" : ""}`} // Áp dụng class animation
                    style={{
                      maxWidth: "150px", // Kích thước tối đa cho logo
                      marginBottom: "16px", // Khoảng cách phía dưới logo
                      zIndex: 3,
                      borderRadius: "10px",
                    }}
                  />
                )}

                {carouselProducts.map((products, index) =>
                  isSelected === index ? (
                    <React.Fragment key={index}>
                      <Typography
                        className={`component-game-description-background  ${animateLogo ? "fade-in-up-text" : ""
                          }`}
                        variant="subtitle1"
                        sx={{
                          textAlign: "left",
                          mt: 1,
                          fontSize: { xs: "0.9rem", md: "1.25rem" },
                        }}
                      >
                        {products.METATITLE}
                      </Typography>
                      <Typography
                        className="component-game-description-background"
                        variant="body1"
                        sx={{ mt: 1, mb: 2 }}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(products.PRICE_PRODUCTDETAILS)}
                      </Typography>
                    </React.Fragment>
                  ) : null
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                  }}
                >
                  <Button
                    className="component-game-btn-play"
                    variant="contained"
                    onClick={() => handleBuyProduct(selectedProduct.ID_PRODUCTDETAILS)}
                    sx={{
                      zIndex: 2,
                      backgroundColor: "white",
                      color: "black",
                      width: "250px",
                      height: "50px",
                      borderRadius: "14px",
                    }}
                  >
                    {t.BuyNow ? t.BuyNow : " Mua Ngay"}
                  </Button>
                  <Button
                    variant="text"
                    fullWidth
                    onClick={handleAddToCart}
                    sx={{
                      zIndex: 2,
                      color: "white",
                      borderRadius: "14px",
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <AddCircleOutlineIcon
                      sx={{ marginRight: "10px", fontSize: "18px" }}
                    />
                    {t.AddToCart ? t.AddToCart : "Thêm vào giỏ hàng"}
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1, // Chiếm 50% chiều rộng bên phải
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></Box>
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: "220px" },
                backgroundColor: currentTheme.backgroundColor,
                display: "flex",

                flexDirection: "column",
                // padding: 2,
                paddingBottom: 2,
                paddingLeft: 2,
                paddingTop: 1,

                borderRadius: "3%",

                mt: { xs: 2, md: 0 },
              }}
            >
              {carouselProducts.map((product, index) => (
                <div
                  key={index}
                  className={`component-game-slider-card ${isSelected === index ? "slider-game-active" : ""
                    }`}
                  onClick={() => {
                    handleClick(product, index);
                  }} // Gọi hàm khi nhấp vào
                >
                  <div className="slider-select-game">
                    <img
                      component="img"
                      src={`${api}/images/${product.GALLERYPRODUCT_DETAILS}`}
                      className="component-game-img-slide"
                      alt={product.GALLERYPRODUCT_DETAILS}
                      sx={{
                        objectFit: "contain",
                      }}
                      style={{ height: "70px" }}
                    />

                    <CardContent>
                      <Typography
                        sx={{
                          color: currentTheme.color,
                          fontSize: "13px",
                          textAlign: "left",
                          mb: 2,
                        }}
                        variant="body2"
                      >
                        {product.NAME_PRODUCTDETAILS}
                      </Typography>
                    </CardContent>
                  </div>
                </div>
              ))}
            </Box>
          </Box>
        </>
      ) : (
        false
      )}
    </>
  );
};

export default CarouselHead;
