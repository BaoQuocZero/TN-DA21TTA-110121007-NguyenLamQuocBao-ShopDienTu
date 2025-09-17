import React, { useEffect, useState } from "react";

import axios from "axios";

import "../css-page/home.css";

import CarouselHead from "../../share-view/carouselHead";
import CartProduct from "../../share-view/cardProduct";
import ListGame from "../../share-view/listGame";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import translations from "../../redux/data/translations";

import ProductCarousel from "../../share-view/productCarousel";
import { getThemeConfig } from "../../service/themeService";

const api = process.env.REACT_APP_URL_SERVER;

const Home = () => {
  const [last2Products, setLast2Products] = useState([]); // 2 sản phẩm mới nhất
  const [bestSellingProducts, setBestSellingProducts] = useState([]); // Sản phẩm bán chạy nhất
  const [bestFavorite, setBestFavorite] = useState([]); // Sản phẩm yêu thích nhất
  const [bestExpensive, setBestExpensive] = useState([]); // Sản phẩm đắt nhất
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [carouselProducts, setCarouselProducts] = useState([]);

  const [GamingGear, setGamingGear] = useState([]); // Sản phẩm bán chạy nhất


  const navigate = useNavigate();

  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const currentTheme = getThemeConfig(
    localStorage.getItem("THEMES") || userInfo?.THEMES || "dark"
  );
  const language = useSelector((state) => state.language.language);
  const t = translations[language].home;

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const [
        last2Response,
        bestSellingResponse,
        bestFavoriteResponse,
        bestExpensiveResponse,
        carouselResponse,
      ] = await Promise.all([
        axios.get(`${api}/api/v1/admin/sanpham/last2Products`), //last2Response
        axios.get(`${api}/api/v1/admin/sanpham/GamingGear`), //bestSellingResponse
        axios.get(`${api}/api/v1/admin/sanpham/LinhKien`), //bestFavoriteResponse
        axios.get(`${api}/api/v1/admin/sanpham/PCGaming`), //bestExpensiveResponse
        axios.get(`${api}/api/v1/admin/sanphamuutien/xemtatca`) //carouselResponse
      ]);

      if (last2Response.data.EC === 1) {
        setLast2Products(last2Response.data.DT);
      }
      if (bestSellingResponse.data.EC === 1) {
        setBestSellingProducts(bestSellingResponse.data.DT);
      }
      if (bestFavoriteResponse.data.EC === 1) {
        setBestFavorite(bestFavoriteResponse.data.DT);
      }
      if (bestExpensiveResponse.data.EC === 1) {
        setBestExpensive(bestExpensiveResponse.data.DT);
      }
      if (carouselResponse.data.EC === 1) {
        setCarouselProducts(carouselResponse.data.DT);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleBuyProduct = (id) => {
    navigate(`/select-game/${id}`);
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className="container-home">
        {" "}
        <div className="home">
          <CarouselHead carouselProducts={carouselProducts} api={api} />

          <ProductCarousel
            title={"PC Gaming Hiệu Năng Cao"}
            products={bestExpensive}
            api={api}
          />

          <Box
            sx={{
              padding: 3,
              backgroundColor: currentTheme.backgroundColor,
            }}
          >
            {" "}
            <Grid container spacing={2}>
              {last2Products.map((product, index) => (
                <Grid item xs={12} sm={6} md={6} key={index}>
                  <Card
                    sx={{
                      backgroundColor: currentTheme.backgroundColor,
                      color: currentTheme.color,
                      textAlign: "left",
                      width: "100%",
                      height: "850px",
                    }}
                  >
                    <CardContent sx={{ padding: 2 }}>
                      <img
                        src={`${api}/images/${product.GALLERYPRODUCT_DETAILS}`}
                        alt={product.NAME_PRODUCTDETAILS}
                        style={{
                          width: "100%",
                          height: "600px",
                          objectFit: "cover", // Đảm bảo hình ảnh không bị méo, sẽ crop nếu cần
                          borderRadius: "8px",
                          marginBottom: 2,
                          transition: "filter 0.3s ease", // Thêm hiệu ứng chuyển tiếp
                        }}
                        className="game-thumbnail" // Thêm lớp CSS cho hình ảnh
                      />
                      <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {product.NAME_PRODUCTDETAILS}
                      </Typography>
                      <Typography variant="h6">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.PRICE_PRODUCTDETAILS)}
                      </Typography>{" "}
                      <Box>
                        {" "}
                        <Typography
                          onClick={() => handleBuyProduct(product.ID_PRODUCT)}
                          sx={{
                            marginBottom: 2,
                            cursor: "pointer",
                            borderBottom: "1px solid #fff",
                            display: "inline-block",
                          }}
                        >
                          Xem Thêm
                        </Typography>
                      </Box>
                      <Button
                        onClick={() => handleBuyProduct(product.ID_PRODUCT)}
                        variant="contained"
                        sx={{
                          backgroundColor: "#343437",
                          color: "#fff",
                          borderRadius: "8px",
                          "&:hover": {
                            backgroundColor: "#4a4a4a", // Màu sáng hơn khi hover
                          },
                        }}
                      >
                        Mua ngay
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>{" "}

          <ProductCarousel
            title={"Phụ kiện chơi game"}
            products={bestSellingProducts}
            api={api}
          />
          <Box
            sx={{
              backgroundColor: currentTheme.backgroundColor,
              padding: 3,
              width: "100%",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                {bestSellingProducts && bestSellingProducts.length > 0 && (
                  <ListGame
                    title="Gaming Gear"
                    api={api}
                    items={bestSellingProducts}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                {bestExpensive && bestExpensive.length > 0 && (
                  <ListGame
                    title="PC Gaming Hiệu Năng Cao"
                    api={api}
                    items={bestExpensive}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                {bestFavorite && bestFavorite.length > 0 ? (
                  <ListGame
                    title="Linh Kiện Nâng Cấp"
                    items={bestFavorite}
                    api={api}
                  />
                ) : null}
              </Grid>
            </Grid>
          </Box>{" "}
        </div>
      </div>
    </>
  );
};

export default Home;
