import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import thư viện jwt-decode
import ModalComment from "../modal/comment-modal";
import ProductDetailModal from "../../admin-view/pages/modal/chiTietDonHang"

const categoryOptions = [
  "Tất cả",
  "Đang chờ xác nhận",
  "Đang giao",
  "Đã giao hàng",
];

const sortOptions = [{ label: "Title", value: "title" }];
const LibraryComponent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title");
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [donHang, setDonHang] = useState([]);
  const [wishlistGame, setWishlistGame] = useState([]);
  const getAccessToken = () => {
    const accessToken = Cookies.get("accessToken"); // Lấy token từ cookie
    if (!accessToken)
      throw new Error("Access token không tồn tại trong cookie!");
    return accessToken;
  };

  const fetchGameList = async () => {
    try {
      const accessToken = getAccessToken();

      const decodedToken = jwtDecode(accessToken);
      const ID_USER = decodedToken?.ID_USER || decodedToken[0]?.ID_USER;
      console.log("decodedToken: ", decodedToken)

      if (!ID_USER) throw new Error("ID_USER không tồn tại trong accessToken!");

      // Gửi request đến API
      const response = await axios.post(
        "http://localhost:8081/api/use/LichSuMuaHangCaNhan",
        { ID_USER }
      );

      // Kiểm tra dữ liệu trả về
      if (response.data.EC === 1) {
        setDonHang(response.data.DT);
      } else {
        throw new Error("API trả về lỗi!");
      }
    } catch (error) {
      console.error("Lỗi khi fetch danh sách game:", error.message);
    }
  };

  useEffect(() => {
    fetchGameList();
  }, []);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    // Nếu value chỉ là chuỗi, biến thành mảng
    setSelectedCategories(Array.isArray(value) ? value : [value]);
    console.log(
      "Selected Categories: ",
      Array.isArray(value) ? value : [value]
    ); // Kiểm tra giá trị đã chọn
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleFavoriteFilterChange = () => {
    setFavoriteFilter(!favoriteFilter);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredDonHang = donHang
    .filter((order) => {
      // Tìm kiếm theo searchTerm
      const matchesSearch = searchTerm
        ? order.STATUS.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.PAYMENTSTATUS.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.ID_ORDER.toString().includes(searchTerm)
        : true;

      // Lọc theo category
      const matchesCategory =
        selectedCategories.includes("Tất cả") || selectedCategories.length === 0
          ? true
          : selectedCategories.includes(order.STATUS);

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "price") {
        return b.TOTALORDERPRICE - a.TOTALORDERPRICE; // sắp xếp theo giá
      }
      if (sortOption === "date") {
        return new Date(b.CREATEAT) - new Date(a.CREATEAT); // sắp xếp theo ngày
      }
      return 0;
    });


  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenModal = (orderId) => {
    setSelectedOrder(orderId);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#121212", // Nền tối chủ đạo
          color: "#e0e0e0", // Chữ sáng dễ đọc
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Box sx={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {/* Filter Sidebar */}
          <Box
            sx={{
              width: "250px",
              backgroundColor: "#1e1e1e", // Nền sidebar tối
              padding: "20px",
              color: "#e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", // Tăng bóng đổ để sidebar nổi bật hơn
              minHeight: "fit-content",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                marginBottom: "20px",
                fontSize: "1.1rem",
              }}
            >
              Lọc
            </Typography>

            <Box sx={{ marginBottom: "20px" }}>
              <TextField
                variant="outlined"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                sx={{
                  backgroundColor: "#333333",
                  color: "#e0e0e0",
                  "& .MuiInputBase-input": {
                    color: "#e0e0e0",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#e0e0e0",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#444444",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00bcd4",
                  },
                }}
              />
            </Box>

            <Box sx={{ marginBottom: "20px" }}>
              <TextField
                select
                variant="outlined"
                label="Trạng thái"
                value={selectedCategories}
                onChange={handleCategoryChange}
                fullWidth
                multiple
                sx={{
                  backgroundColor: "#333333",
                  color: "#e0e0e0",
                  "& .MuiInputBase-input": {
                    color: "#e0e0e0",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#e0e0e0",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#444444",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00bcd4",
                  },
                }}
              >
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* Game List */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                marginBottom: "20px",
                fontWeight: "bold",
                color: "#e0e0e0",
                fontSize: "1.5rem",
              }}
            >
              Lịch sử mua hàng
            </Typography>

            <Grid container spacing={3}>
              <>
                {filteredDonHang.map((order, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        backgroundColor: "#333333",
                        color: "#e0e0e0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.8)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#3ccaff" }}
                        >
                          Đơn hàng #{order.ID_ORDER}
                        </Typography>

                        <Typography variant="body2" sx={{ color: "#999999" }}>
                          Ngày đặt: {new Date(order.CREATEAT).toLocaleDateString("vi-VN")}
                        </Typography>

                        <Typography variant="body2"
                          sx={{
                            mt: 1,
                            fontWeight: "bold",
                            color:
                              order.STATUS === "Đã giao hàng"
                                ? "green"
                                : order.STATUS === "Đang chờ xác nhận"
                                  ? "red"
                                  : "orange",
                          }}>
                          Trạng thái: <b>{order.STATUS}</b>
                        </Typography>
                        <Typography variant="body2">
                          Thanh toán: <b>{order.PAYMENTSTATUS}</b> ({order.PAYMENTMETHOD})
                        </Typography>
                        <Typography variant="body2">
                          Số lượng: {order.QUANTITY}
                        </Typography>
                        <Typography variant="body2">
                          Tổng tiền:{" "}
                          {order.TOTALORDERPRICE.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Typography>

                        <Box sx={{ gap: "10px", mt: 2 }}>
                          <Button
                            variant="contained"
                            sx={{
                              width: "100%",
                              backgroundColor: "#3ccaff",
                              color: "#121212",
                            }}
                            onClick={() => handleOpenModal(order.ID_ORDER)}
                          >
                            Xem chi tiết
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

              </>
            </Grid>

          </Box>
        </Box>{" "}
      </Box>

      {open && selectedOrder && (
        <ProductDetailModal
          productId={selectedOrder}
          onClose={handleCloseModal}
        />
      )}{" "}
    </>
  );
};

export default LibraryComponent;
