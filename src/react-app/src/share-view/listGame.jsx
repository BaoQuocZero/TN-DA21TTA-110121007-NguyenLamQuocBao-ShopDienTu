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
        ID_USER: userInfo?.ID_USER || userInfo[0].ID_USER,
        ID_PRODUCTDETAILS: product.ID_PRODUCTDETAILS,
      };

      const response = await axios.post(`${api}/api/v1/giohang/them`, payload);

      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        dispatch(setTotalCart(response.data.totalQuantity));
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
          const status = productStatus.find((ps) => ps.ID_PRODUCTDETAILS === item.ID_PRODUCTDETAILS) || {
            favoriteStatus: false,
            buyStatus: false,
          };
          const { favoriteStatus, buyStatus } = status;

          return (
            <Card
              key={index}
              onClick={() => handleBuyProduct(item.ID_PRODUCT)}
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
                  src={`${api}/images/${item.GALLERYPRODUCT_DETAILS}`}
                  alt={item.NAME_PRODUCTDETAILS}
                  style={{
                    width: "50px",
                    height: "75px",
                    borderRadius: "10%",
                    transition: "filter 0.3s ease",
                  }}
                  className="thumbnail"
                />
                <Box sx={{ marginLeft: 2, flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={item.NAME_PRODUCTDETAILS} // hiển thị tooltip khi hover
                  >
                    {item.NAME_PRODUCTDETAILS}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#bbb" }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.PRICE_PRODUCTDETAILS)}
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
