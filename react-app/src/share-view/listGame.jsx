import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import "./css/listGame.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { setTotalCart } from "../redux/authSlice";
import translations from "../redux/data/translations";
import { getThemeConfig } from "../service/themeService";

const ListGame = ({ title, items, api }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productStatus, setProductStatus] = useState([]); // Danh sách trạng thái sản phẩm

  const language = useSelector((state) => state.language.language);
  const t = translations[language].homeProductCarousel;
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const currentTheme = getThemeConfig(
    localStorage.getItem("THEMES") || userInfo?.THEMES || "dark"
  );

  // Gọi API kiểm tra trạng thái sản phẩm khi component load
  useEffect(() => {
    const fetchProductStatus = async () => {
      if (isAuthenticated && userInfo?.MA_KH) {
        const productIds = items.map((item) => item.MASP);
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
  }, [isAuthenticated, userInfo, items, api]);

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
        enqueueSnackbar(response.data.EM);
        dispatch(setTotalCart(response.data.totalQuantity));
      } else {
        enqueueSnackbar(response.data.EM);
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.EM);
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
        enqueueSnackbar(response.data.EM);
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
      if (error.response?.data?.EC === 0) {
        enqueueSnackbar(error.response.data.EM, { variant: "info" });
      }
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
        enqueueSnackbar(response.data.EM);
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
    <Box>
      <Typography
        variant="h6"
        sx={{ marginBottom: 1, zIndex: 200, color: currentTheme.color }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          flex: "1 1 30%",
          display: "flex",
          flexDirection: "column",
          borderLeft: "0.3px solid rgba(255, 255, 255, 0.3)",
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        {items.map((item, index) => {
          const status = productStatus.find((ps) => ps.MASP === item.MASP) || {
            favoriteStatus: false,
            buyStatus: false,
          };
          const { favoriteStatus, buyStatus } = status;

          return (
            <Card
              key={index}
              onClick={() => handleBuyProduct(item.MASP)}
              sx={{
                cursor: "pointer",
                marginBottom: 2,
                backgroundColor: currentTheme.backgroundColor,
                color: currentTheme.color,
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: currentTheme.accentColor,
                },
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src={`${api}/images/${item.ANH_SP}`}
                  alt={item.TENSP}
                  style={{
                    width: "50px",
                    height: "75px",
                    borderRadius: "10%",
                    transition: "filter 0.3s ease",
                  }}
                  className="thumbnail"
                />
                <Box sx={{ marginLeft: 2, flexGrow: 1 }}>
                  <Typography variant="body2" noWrap>
                    {item.TENSP}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#bbb" }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.DON_GIA)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {!buyStatus && (
                    <>
                      <Tooltip title={t.AddToCart} arrow>
                        <IconButton
                          sx={{
                            color: currentTheme.color,
                            position: "relative",
                            fontSize: "20px",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.2)",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                        >
                          <AddShoppingCartIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={favoriteStatus ? t.RemoveFromWish : t.AddToWish}
                        arrow
                      >
                        <IconButton
                          sx={{
                            color: favoriteStatus ? "red" : currentTheme.color,
                            position: "relative",
                            fontSize: "20px",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.2)",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (favoriteStatus) {
                              handleRemoveFromWish(item); // Xóa khỏi yêu thích
                            } else {
                              handleAddToWish(item); // Thêm vào yêu thích
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
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default ListGame;
