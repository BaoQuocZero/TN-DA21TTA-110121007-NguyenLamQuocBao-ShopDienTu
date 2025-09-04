import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import "./css/productCarousel.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setTotalCart } from "../redux/authSlice";
import { enqueueSnackbar } from "notistack";
import translations from "../redux/data/translations";
import { getThemeConfig } from "../service/themeService";

const ProductCarousel = ({ title, products, api }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productLength, setProductLength] = useState(0);
  const [disable, setDisable] = useState(false);
  const [productStatus, setProductStatus] = useState([]); // Danh sách trạng thái sản phẩm
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);
  const t = translations[language].homeProductCarousel;
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const currentTheme = getThemeConfig(
    localStorage.getItem("THEMES") || userInfo?.THEMES || "dark"
  );

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      setProductLength(products.length);
    }
  }, [products]);

  // Gọi API kiểm tra trạng thái sản phẩm khi component load
  useEffect(() => {
    const fetchProductStatus = async () => {
      if (isAuthenticated && userInfo?.ID_USER && products.length > 0) {
        const productIds = products.map((item) => item.ID_PRODUCTDETAILS);
        try {
          const response = await axios.post(
            `${api}/api/v1/yeuthich/check-product-status`,
            {
              userId: userInfo.ID_USER,
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
    fetchProductStatus();
  }, [isAuthenticated, userInfo, products, api]);

  const nextSlide = () => {
    if (currentIndex + 5 < productLength) {
      setCurrentIndex((prevIndex) => prevIndex + 5);
    } else {
      setCurrentIndex(productLength - (productLength % 5));
    }
  };

  const prevSlide = () => {
    if (currentIndex - 5 >= 0) {
      setCurrentIndex((prevIndex) => prevIndex - 5);
    } else {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    setDisable(currentIndex + 5 >= productLength);
  }, [currentIndex, productLength]);

  const handleBuyProduct = (id) => {
    navigate(`/select-game/${id}`);
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      // console.log(userInfo)
      const payload = {
        ID_USER: userInfo?.ID_USER || userInfo[0].ID_USER,
        ID_PRODUCTDETAILS: product.ID_PRODUCTDETAILS,
      };
      const response = await axios.post(`${api}/api/v1/giohang/them`, payload);
      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        dispatch(setTotalCart(response.data.totalQuantity));
      } else if (response.data.EC === 0) {
        enqueueSnackbar(response.data.EM, { variant: "info" });
      }
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
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
        ID_USER: userInfo.ID_USER,
        ID_PRODUCTDETAILS: product.ID_PRODUCTDETAILS,
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
      } else if (response.data.EC === 0) {
        enqueueSnackbar(response.data.EM, { variant: "info" });
      }
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
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
        ID_USER: userInfo.ID_USER,
        ID_PRODUCTDETAILS: product.ID_PRODUCTDETAILS,
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
      console.error("Lỗi khi xóa sản phẩm yêu thích:", error);
      enqueueSnackbar("Lỗi khi xóa sản phẩm yêu thích", { variant: "error" });
    }
  };

  return (
    <div
      className="container-product-carousel mt-4 mb-4"
      style={{ width: "100%" }}
    >
      <IconButton
        onClick={prevSlide}
        disabled={currentIndex === 0}
        sx={{
          position: "absolute",
          right: "0",
          marginRight: "90px",
          top: "0%",
          transform: "translateY(-50%)",
          zIndex: 1,
          backgroundColor: "#444447",
          width: "30px",
          color: "#fff",
          height: "30px",
          "&:hover": {
            backgroundColor: "#636366",
          },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: "15px", color: "#fff" }} />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        disabled={disable}
        sx={{
          position: "absolute",
          right: 0,
          top: "0%",
          transform: "translateY(-50%)",
          zIndex: 1,
          marginRight: "40px",
          backgroundColor: "#444447",
          width: "30px",
          height: "30px",
          "&:hover": {
            backgroundColor: "#636366",
          },
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: "15px", color: "#fff" }} />
      </IconButton>
      <Typography
        variant="h6"
        sx={{
          textAlign: "left",
          color: "#fff",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          "&:hover .arrow-icon": {
            marginLeft: "15px",
            transition: "margin-left 0.3s ease",
          },
        }}
      >
        {title}
        <ArrowForwardIosIcon
          className="arrow-icon"
          sx={{ fontSize: "19px", color: "#fff", marginLeft: "10px" }}
        />
      </Typography>
      <Box
        sx={{
          display: "flex",
          overflow: "hidden",
          padding: "20px 0",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            transition: "transform 0.5s ease",
            transform: `translateX(-${(currentIndex * 100) / 5}%)`,
            width: `100%`,
          }}
        >
          {products && products.length > 0 ? (
            products.map((product, index) => {
              const status = productStatus.find(
                (ps) => ps.ID_PRODUCTDETAILS === product.ID_PRODUCTDETAILS
              ) || {
                favoriteStatus: false,
                buyStatus: false,
              };
              const { favoriteStatus, buyStatus } = status;

              return (
                <Card
                  key={index}
                  sx={{
                    flex: `0 0 ${100 / 5}%`, // mỗi card chiếm 1 phần theo số visibleItems
                    maxWidth: `${100 / 5}%`,
                    height: 380,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: currentTheme.backgroundColor,
                    color: currentTheme.color,
                    padding: 1,
                    borderRadius: "10px",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                  onClick={() => handleBuyProduct(product.ID_PRODUCTDETAILS)}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={`${api}/images/${product.GALLERYPRODUCT_DETAILS}`}
                      alt={product.NAME_PRODUCTDETAILS}
                      sx={{
                        height: {
                          xs: "260px",
                          sm: "260px",
                          md: "260px",
                          lg: "260px",
                        },
                        objectFit: "contain",
                        borderRadius: "15px",
                        transition: "filter 0.3s ease",
                        "&:hover": {
                          filter: "brightness(1.4)",
                        },
                      }}
                    />
                  </Box>
                  <CardContent sx={{ ml: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "left",
                        minHeight: "40px", // Đảm bảo chiều cao cố định
                        display: "-webkit-box",
                        WebkitLineClamp: 2, // Giới hạn 2 dòng
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        "&:hover": {
                          filter: "brightness(1.1)",
                        },
                      }}
                    >
                      {product.NAME_PRODUCTDETAILS}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        textAlign: "left",
                        display: "flex",
                        marginTop: "4px",
                        justifyContent: "space-between",
                        alignItems: "center", // Căn icon giữa dòng
                      }}
                    >
                      {product.PRICE_PRODUCTDETAILS
                        ? `${product.PRICE_PRODUCTDETAILS.toLocaleString("vi-VN")}đ`
                        : "Giá không có sẵn"}

                      <Tooltip title={t.AddToCart} arrow>
                        <IconButton
                          sx={{
                            cursor: "pointer",
                            color: "#fff",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            "&:hover": {
                              backgroundColor: "#ff9800",
                              color: "#fff",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                        >
                          <AddShoppingCartIcon />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </CardContent>

                </Card>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Không có sản phẩm nào
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default ProductCarousel;
