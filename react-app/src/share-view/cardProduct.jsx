import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { getThemeConfig } from "../service/themeService";
const CartProduct = ({ title, products, api }) => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const currentTheme = getThemeConfig(
    localStorage.getItem("THEMES") || userInfo?.THEMES || "dark"
  );
  const navigate = useNavigate();
  const handleBuyProduct = (id) => {
    navigate(`/select-game/${id}`);
  };

  return (
    <Box sx={{ padding: "20px", width: "100%" }}>
      {" "}
      <Box
        sx={{
          padding: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
        }}
      >
        {" "}
        <Typography
          variant="h6"
          sx={{
            textAlign: "left",
            color: "#fff",
            cursor: "pointer",
            display: "inline-flex", // Thay đổi cách hiển thị để mũi tên nằm cạnh chữ
            alignItems: "center", // Căn giữa chữ và mũi tên theo chiều dọc
            "&:hover .arrow-icon": {
              marginLeft: "15px", // Di chuyển mũi tên sang trái 10px khi hover
              transition: "margin-left 0.3s ease", // Hiệu ứng chuyển tiếp
            },
          }}
        >
          {title}
          <ArrowForwardIosIcon
            className="arrow-icon"
            sx={{ fontSize: "19px", color: "#fff", marginLeft: "10px" }}
          />
        </Typography>
      </Box>
      <Grid container spacing={2} justifyContent="flex-start">
        {products && products.length > 0 ? (
          products.map((product, index) => {
            // Tạo discount ngẫu nhiên trong khoảng 10% đến 30%
            const discountPercentage =
              Math.floor(Math.random() * (30 - 10 + 1)) + 10;
            const originalPrice = (
              product.PRICE_PRODUCTDETAILS *
              (1 + discountPercentage / 100)
            ).toFixed(0);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  onClick={() => handleBuyProduct(product.ID_PRODUCTDETAILS)}
                  sx={{
                    height: "auto",
                    backgroundColor: currentTheme.backgroundColor,
                    color: "#fff",
                    filter: "brightness(0.9)",
                    cursor: "pointer",
                    transition: "filter 0.3s ease, transform 0.3s ease",
                    "&:hover": {
                      filter: "brightness(1.1)",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ objectFit: "contain", height: "200px" }}
                    image={`${api}/images/${product.GALLERYPRODUCT_DETAILS}`}
                    alt={product.NAME_PRODUCTDETAILS}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ textAlign: "left", color: currentTheme.color }}
                    >
                      {product.NAME_PRODUCTDETAILS}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                      }}
                    >
                      {/* Hiển thị discount ngẫu nhiên */}
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{
                          backgroundColor: "#26bbff",
                          borderRadius: "10px",
                          padding: "1px 5px",
                          color: "#101014",
                          marginRight: "10px",
                        }}
                      >
                        {`${discountPercentage}% `}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: "line-through",
                          opacity: 0.7,
                          marginRight: "10px",
                          color: currentTheme.color,
                        }}
                      >
                        {parseInt(originalPrice).toLocaleString("vi-VN")} ₫
                      </Typography>

                      {/* Giá thật, định dạng theo VND */}
                      <Typography sx={{ color: currentTheme.color }}>
                        {parseInt(product.PRICE_PRODUCTDETAILS).toLocaleString("vi-VN")} ₫
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography variant="body1" color="textSecondary">
            No products available.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default CartProduct;
