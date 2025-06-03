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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getThemeConfig } from "../../service/themeService";

const CommentsSection = ({ reviews }) => {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showReviews, setShowReviews] = useState([]); // Khởi tạo rỗng
  const [starFilter, setStarFilter] = useState("Tất cả");
  const [timeFilter, setTimeFilter] = useState("latest");
  console.log("reviews", reviews);
  const currentTheme = getThemeConfig(localStorage.getItem("THEMES") || "dark");
  const api = process.env.REACT_APP_URL_SERVER;

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
        (a, b) => new Date(b.NGAY_MUA) - new Date(a.NGAY_MUA)
      );
    } else if (option === "oldest") {
      filteredReviews.sort(
        (a, b) => new Date(a.NGAY_MUA) - new Date(b.NGAY_MUA)
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
          (review) => parseInt(review.DANH_GIA) === parseInt(starFilter)
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
                  key={index}
                  sx={{
                    marginBottom: 2,
                    padding: 2,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                    }}
                  >
                    <Avatar
                      alt={review.HO_TEN}
                      src={`${api}/images/${review.AVATAR}`}
                      sx={{
                        width: 40,
                        height: 40,
                        marginRight: 2,
                      }}
                    />
                    <Typography variant="body1">{review.HO_TEN}</Typography>
                  </Box>
                  <Box sx={{ marginBottom: 1 }}>
                    <Rating
                      value={parseFloat(review.DANH_GIA)}
                      readOnly
                      precision={0.5}
                      sx={{ marginTop: 0.5, fontSize: 13 }}
                    />
                  </Box>
                  <Typography variant="body2">{review.BINH_LUAN}</Typography>
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
