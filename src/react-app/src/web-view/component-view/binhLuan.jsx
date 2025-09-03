import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  Box,
  Avatar,
  Rating,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getThemeConfig } from "../../service/themeService";
import { useSelector, useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";

const CommentsSection = ({ reviews, onAddComment }) => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);

  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showReviews, setShowReviews] = useState([]); // Khởi tạo rỗng
  const [starFilter, setStarFilter] = useState("Tất cả");
  const [timeFilter, setTimeFilter] = useState("latest");
  // State cho comment mới
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const currentTheme = getThemeConfig(localStorage.getItem("THEMES") || "dark");
  const api = process.env.REACT_APP_URL_SERVER;

  // Hàm gửi bình luận
  const handleAddComment = () => {
    if (!newComment.trim() || newRating === 0) {
      enqueueSnackbar("Vui lòng nhập nội dung và chọn số sao");
      return;
    }

    const newReview = {
      ID_USER: userInfo?.ID_USER || userInfo[0].ID_USER,
      FIRSTNAME: userInfo?.FIRSTNAME || userInfo[0].FIRSTNAME || "",
      LASTNAME: userInfo?.LASTNAME || userInfo[0].LASTNAME || "",
      CONTENT_COMMENT: newComment,
      RATING: newRating,
      CREATEAT: new Date().toISOString(),
    };

    if (onAddComment) {
      onAddComment(newReview); // callback để cập nhật danh sách ngoài parent
    }

    // reset form
    setNewRating(0);
    setNewComment("");
  };

  // Hàm lọc theo số sao
  const handleStarFilterChange = (event) => {
    const star = event.target.value;
    setStarFilter(star);

    let filteredReviews = [...reviews];
    if (star !== "Tất cả") {
      filteredReviews = filteredReviews.filter(
        (review) => parseInt(review.DANH_GIA) === parseInt(star)
      );
    }
    filterByTime(filteredReviews, timeFilter);
  };

  // Hàm lọc theo thời gian
  const handleTimeFilterChange = (event) => {
    const option = event.target.value;
    setTimeFilter(option);
    filterByTime(reviews, option); // Dùng toàn bộ reviews khi thay đổi thời gian
  };

  // Lọc và cập nhật danh sách hiển thị
  const filterByTime = (data, option) => {
    let filteredReviews = [...data];
    if (option === "latest") {
      filteredReviews.sort(
        (a, b) => new Date(b.CREATEAT) - new Date(a.CREATEAT)
      );
    } else if (option === "oldest") {
      filteredReviews.sort(
        (a, b) => new Date(a.CREATEAT) - new Date(b.CREATEAT)
      );
    }
    setShowReviews(
      filteredReviews.slice(0, showAll ? filteredReviews.length : 10)
    );
  };

  // Xử lý khi bấm "Xem tất cả" hoặc "Thu gọn"
  const handleShowAll = () => {
    setShowAll(true);
    setShowReviews(reviews);
  };

  const handleShowLess = () => {
    setShowAll(false);
    filterByTime(reviews, timeFilter); // Áp dụng lại bộ lọc khi thu gọn
  };

  // Cập nhật showReviews khi expanded hoặc reviews thay đổi
  useEffect(() => {
    if (expanded) {
      let filteredReviews = [...reviews];
      if (starFilter !== "Tất cả") {
        filteredReviews = filteredReviews.filter(
          (review) => parseInt(review.RATING) === parseInt(starFilter)
        );
      }
      filterByTime(filteredReviews, timeFilter);
    } else {
      setShowReviews([]); // Xóa danh sách khi Accordion đóng
    }
  }, [expanded, reviews, starFilter, timeFilter]);

  return (
    <Box sx={{ width: "100%" }}>
      <Accordion
        sx={{
          backgroundColor: currentTheme.backgroundColor,
          color: currentTheme.color,
        }}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">Xem bình luận ({reviews.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              paddingBottom: 2,
              backgroundColor: currentTheme.backgroundColor,
            }}
          >
            {/* Bộ lọc */}
            <Box sx={{ marginBottom: 2, display: "flex" }}>
              <Box>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  Lọc theo số sao:
                </Typography>
                <Select
                  value={starFilter}
                  onChange={handleStarFilterChange}
                  sx={{ color: "#fff", backgroundColor: "#202020", width: 200 }}
                >
                  <MenuItem value="Tất cả">Tất cả</MenuItem>
                  <MenuItem value="5">5 sao</MenuItem>
                  <MenuItem value="4">4 sao</MenuItem>
                  <MenuItem value="3">3 sao</MenuItem>
                  <MenuItem value="2">2 sao</MenuItem>
                  <MenuItem value="1">1 sao</MenuItem>
                </Select>
              </Box>
              <Box sx={{ marginLeft: "10px" }}>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  Lọc theo thời gian bình luận:
                </Typography>
                <Select
                  value={timeFilter}
                  onChange={handleTimeFilterChange}
                  sx={{ color: "#fff", backgroundColor: "#202020" }}
                >
                  <MenuItem value="latest">Lượt bình luận mới nhất</MenuItem>
                  <MenuItem value="oldest">Lượt bình luận cũ nhất</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Form thêm bình luận */}
            <Box sx={{ marginBottom: 3 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                Viết bình luận của bạn
              </Typography>

              <Rating
                value={newRating}
                onChange={(e, newValue) => setNewRating(newValue)}
                precision={1}
                sx={{
                  marginBottom: 1,
                  color: "#ffb400", // màu sao khi đã chọn
                }}
                emptyIcon={
                  <StarIcon style={{ color: "rgba(255, 255, 255, 0.5)" }} fontSize="inherit" />
                }
              />


              <TextField
                fullWidth
                multiline
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Nhập nội dung bình luận..."
                InputProps={{
                  sx: {
                    color: "#fff", // chữ nhập vào trắng
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: "rgba(255,255,255,0.7)", // label sáng hơn
                  },
                }}
                sx={{
                  marginBottom: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": { borderColor: "#3ccaff" }, // hover sáng
                    "&.Mui-focused fieldset": { borderColor: "#3ccaff" }, // khi focus
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={handleAddComment}
                sx={{
                  backgroundColor: "#3ccaff",
                  color: "#121212",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#1ea8d9",
                  },
                }}
              >
                Gửi bình luận
              </Button>
            </Box>

            {/* Danh sách bình luận */}
            {showReviews.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  marginTop: 2,
                  color: "gray",
                }}
              >
                Hãy mua sản phẩm này để trở thành người bình luận đầu tiên.
              </Typography>
            ) : (
              showReviews.map((review, index) => (
                <Box
                  key={review.ID_COMMENT}
                  sx={{
                    marginBottom: 2,
                    padding: 2,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                  }}
                >
                  {/* Thông tin người bình luận */}
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                    {review.AVATAR ? (
                      <Avatar
                        alt={`${review.FIRSTNAME} ${review.LASTNAME}`}
                        src={`${api}/images/${review.AVATAR}`}
                        sx={{ width: 40, height: 40, marginRight: 2 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 40, height: 40, marginRight: 2 }}>
                        {review.FIRSTNAME?.charAt(0)}
                      </Avatar>
                    )}

                    <Box>
                      <Typography variant="body1">
                        {review.FIRSTNAME} {review.LASTNAME}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.CREATEAT).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Số sao */}
                  <Rating
                    value={parseFloat(review.RATING)}
                    readOnly
                    precision={0.5}
                    sx={{ marginBottom: 1, fontSize: 16 }}
                  />

                  {/* Nội dung bình luận */}
                  <Typography variant="body2">{review.CONTENT_COMMENT}</Typography>
                </Box>
              ))
            )}

            {/* Nút Xem tất cả / Thu gọn */}
            {reviews.length > 10 && !showAll && (
              <Button onClick={handleShowAll} sx={{ marginTop: 2 }}>
                Xem tất cả
              </Button>
            )}
            {showAll && reviews.length > 10 && (
              <Button onClick={handleShowLess} sx={{ marginTop: 2 }}>
                Thu gọn
              </Button>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CommentsSection;
