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
      const payload = {
        MASP: product.MASP,
        MANGUOIDUNG: userInfo.MA_KH,
        NGAY_CAP_NHAT_GIOHANG: new Date().toISOString(),
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
                (ps) => ps.MASP === product.MASP
              ) || {
                favoriteStatus: false,
                buyStatus: false,
              };
              const { favoriteStatus, buyStatus } = status;

              return (
                <Card
                  key={index}
                  sx={{
                    backgroundColor: currentTheme.backgroundColor,
                    color: currentTheme.color,
                    padding: 1,
                    flexShrink: 0,
                    margin: "2px",
                    cursor: "pointer",
                    width: { xs: "100%", sm: "30%", md: "260px", lg: "260px" },
                    transition:
                      "background-color 0.3s ease, transform 0.3s ease",
                    position: "relative",
                  }}
                  onClick={() => handleBuyProduct(product.MASP)}
                >
                  <Box sx={{ position: "relative" }}>
                    {!buyStatus && (
                      <Tooltip
                        title={favoriteStatus ? t.RemoveFromWish : t.AddToWish}
                        arrow
                      >
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: favoriteStatus ? "red" : currentTheme.color,
                            borderRadius: "50%",
                            margin: "8px",
                            fontSize: "25px",
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.2)",
                            },
                            zIndex: 1, // Đảm bảo nút nổi lên trên CardMedia
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện lan truyền lên Card
                            e.preventDefault(); // Ngăn hành vi mặc định (nếu có)
                            if (favoriteStatus) {
                              handleRemoveFromWish(product);
                            } else {
                              handleAddToWish(product);
                            }
                          }}
                        >
                          {favoriteStatus ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                    <CardMedia
                      component="img"
                      image={`${api}/images/${product.ANH_SP}`}
                      alt={product.TENSP}
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
                        "&:hover": {
                          filter: "brightness(1.1)",
                        },
                      }}
                    >
                      {product.TENSP}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        textAlign: "left",
                        display: "flex",
                        marginTop: "4px",
                        justifyContent: "space-between",
                      }}
                    >
                      {product.DON_GIA
                        ? `${product.DON_GIA.toLocaleString("vi-VN")}đ`
                        : "Giá không có sẵn"}
                      {!buyStatus && (
                        <Tooltip title={t.AddToCart} arrow>
                          <IconButton
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                color: "#555",
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Ngăn sự kiện lan truyền lên Card
                              e.preventDefault(); // Ngăn hành vi mặc định (nếu có)
                              handleAddToCart(product);
                            }}
                          >
                            <AddShoppingCartIcon />
                          </IconButton>
                        </Tooltip>
                      )}
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
