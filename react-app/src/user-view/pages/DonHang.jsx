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
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import thư viện jwt-decode
import ModalComment from "../modal/comment-modal";

const categoryOptions = [
  "Tất cả",
  "Action",
  "RPG",
  "Adventure",
  "Family",
  "Strategy",
  "Simulation",
  "Battle Royale",
  "Shooter",
  "Open World",
];

const sortOptions = [{ label: "Title", value: "title" }];
const LibraryComponent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title");
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [games, setGames] = useState([]);
  const [wishlistGame, setWishlistGame] = useState([]);
  const getAccessToken = () => {
    const accessToken = Cookies.get("accessToken"); // Lấy token từ cookie
    if (!accessToken)
      throw new Error("Access token không tồn tại trong cookie!");
    return accessToken;
  };

  const fetchGameList = async () => {
    try {
      // Lấy MA_KH từ accessToken
      const accessToken = getAccessToken();

      // Decode accessToken để lấy thông tin từ payload
      const decodedToken = jwtDecode(accessToken);
      const MA_KH = decodedToken?.MA_KH; // Lấy MA_KH từ decoded payload

      if (!MA_KH) throw new Error("MA_KH không tồn tại trong accessToken!");

      // Gửi request đến API
      const response = await axios.post(
        "http://localhost:8081/api/use/laydanhsachgamecanhan",
        { MA_KH }
      );

      // Kiểm tra dữ liệu trả về
      if (response.data.EC === 1) {
        console.log("Danh sách game:", response.data.DT);
        setGames(response.data.DT); // Cập nhật state games với dữ liệu trả về
      } else {
        throw new Error("API trả về lỗi!");
      }
    } catch (error) {
      console.error("Lỗi khi fetch danh sách game:", error.message);
    }
  };

  const fetchGamewishList = async () => {
    try {
      // Lấy MA_KH từ accessToken
      const accessToken = getAccessToken();

      // Decode accessToken để lấy thông tin từ payload
      const decodedToken = jwtDecode(accessToken);
      const MA_KH = decodedToken?.MA_KH; // Lấy MA_KH từ decoded payload

      if (!MA_KH) throw new Error("MA_KH không tồn tại trong accessToken!");

      // Gửi request đến API
      const response = await axios.post(
        "http://localhost:8081/api/use/laydanhsachgamecanhanwishlist",
        { MA_KH }
      );

      if (response.data.EC === 1) {
        console.log("Danh sách game:", response.data.DT);
        setWishlistGame(response.data.DT);
      } else {
        throw new Error("API trả về lỗi!");
      }
    } catch (error) {
      console.error("Lỗi khi fetch danh sách game:", error.message);
    }
  };

  useEffect(() => {
    fetchGameList();
    fetchGamewishList();
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

  const filteredGames = (tabValue === 0 ? games : wishlistGame) // Điều chỉnh danh sách game hiển thị dựa trên tabValue
    .filter((game) => (tabValue === 0 ? true : game.title)) // Hiển thị tất cả game cho All Games, và chỉ hiển thị game yêu thích cho tab Favorites
    .filter((game) =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((game) => !favoriteFilter || game.favorite)
    .filter(
      (game) =>
        selectedCategories.length === 0 || // Nếu không có thể loại nào được chọn, hiển thị tất cả game
        selectedCategories.includes("Tất cả") || // Nếu chọn "Tất cả", hiển thị tất cả game
        selectedCategories.some(
          // Kiểm tra nếu ít nhất một thể loại của game trùng với thể loại đã chọn
          (category) => game.categories.includes(category)
        )
    )
    .sort((a, b) => {
      if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  const [open, setOpen] = useState(false);
  const [selectGame, setSelectGame] = useState(null);
  const handleOpen = (game) => {
    setOpen(true);
    setSelectGame(game);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
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
              label="Thể loại"
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

          {/* <Box>
            <label style={{ color: "#e0e0e0", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                checked={favoriteFilter}
                onChange={handleFavoriteFilterChange}
                style={{ marginRight: "10px", accentColor: "#00bcd4" }}
              />
              Show Favorites Only
            </label>
          </Box> */}
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
            Thư viện game
          </Typography>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="inherit"
            sx={{
              marginBottom: "20px",
              borderBottom: "2px solid #444444", // Border dưới tab để tạo sự phân tách
            }}
            TabIndicatorProps={{ sx: { backgroundColor: "#00bcd4" } }}
          >
            <Tab
              label="Tất cả game"
              sx={{
                color: tabValue === 0 ? "#00bcd4" : "#999999",
                fontWeight: tabValue === 0 ? "bold" : "normal", // Làm nổi bật tab đang được chọn
              }}
            />
            <Tab
              label="Yêu thích"
              sx={{
                color: tabValue === 1 ? "#00bcd4" : "#999999",
                fontWeight: tabValue === 1 ? "bold" : "normal",
              }}
            />
          </Tabs>

          {/* Game Cards */}
          <Grid container spacing={3}>
            {filteredGames.map((game, index) => {
              const hasReview =
                game.BINH_LUAN !== null || game.DANH_GIA !== null; // Kiểm tra xem đã có bình luận hoặc đánh giá chưa

              return (
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
                    <CardMedia
                      component="img"
                      alt={game.title}
                      height="340"
                      image={`http://localhost:8081/images/${game.image}`}
                      sx={{
                        objectFit: "cover",
                        objectPosition: "center",
                        width: "100%",
                        borderRadius: "8px",
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: "bold",
                          color: "#e0e0e0",
                          fontSize: "1.2rem",
                        }}
                      >
                        {game.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#999999" }}>
                        {game.categories}
                      </Typography>
                      <Box sx={{ gap: "10px", marginTop: "10px" }}>
                        <Button
                          href="https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/installer/download/EpicGamesLauncherInstaller.msi?trackingId=b8b32e6e1e234226835e8a1030acd2ac"
                          target="_blank"
                          variant="contained"
                          sx={{
                            marginTop: "10px",
                            width: "100%",
                            backgroundColor: "#3ccaff",
                            color: "#121212",
                          }}
                        >
                          Tải xuống
                        </Button>
                        {/* Chỉ hiển thị nút "Bình luận" nếu chưa có bình luận và đánh giá */}
                        {!hasReview && (
                          <Button
                            variant="contained"
                            onClick={() => handleOpen(game)}
                            sx={{
                              marginTop: "10px",
                              width: "100%",
                              backgroundColor: "#3ccaff",
                              color: "#121212",
                            }}
                          >
                            Bình luận
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>{" "}
      <ModalComment
        open={open}
        handleClose={handleClose}
        selectGame={selectGame}
        fetchGameList={fetchGameList}
      />
    </Box>
  );
};

export default LibraryComponent;
