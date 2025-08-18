import React from "react";
import {
  Box,
  Typography,
  Link,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Footer = () => {
  return (
    <Box
      sx={{ backgroundColor: "#111", color: "white", padding: "40px 20px" }}
    >
      {/* Biểu tượng mạng xã hội */}
      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        <IconButton color="inherit">
          <FacebookIcon />
        </IconButton>
        <IconButton color="inherit">
          <TwitterIcon />
        </IconButton>
        <IconButton color="inherit">
          <YouTubeIcon />
        </IconButton>
      </Box>

      {/* Các cột thông tin */}
      <Grid container spacing={4} justifyContent="center" textAlign="center">
        {/* Giới thiệu */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Về Chúng Tôi
          </Typography>
          <Box>
            <Link href="#" color="inherit" underline="hover">
              Giới thiệu
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Liên hệ
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Tuyển dụng
            </Link>
          </Box>
        </Grid>

        {/* Hỗ trợ khách hàng */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Hỗ Trợ Khách Hàng
          </Typography>
          <Box>
            <Link href="#" color="inherit" underline="hover">
              Hướng dẫn mua hàng
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Tra cứu đơn hàng
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Bảo hành & Đổi trả
            </Link>
          </Box>
        </Grid>

        {/* Chính sách */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Chính Sách
          </Typography>
          <Box>
            <Link href="#" color="inherit" underline="hover">
              Chính sách bảo mật
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Chính sách thanh toán
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Chính sách vận chuyển
            </Link>
          </Box>
        </Grid>

        {/* Danh mục sản phẩm */}
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Sản Phẩm
          </Typography>
          <Box>
            <Link href="#" color="inherit" underline="hover">
              Laptop
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              PC Gaming
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Màn hình
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Bàn phím & Chuột
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Tai nghe Gaming
            </Link>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ backgroundColor: "#444", marginY: 4 }} />

      {/* Phần bản quyền */}
      <Box sx={{ textAlign: "center", marginBottom: 2 }}>
        <Typography variant="body2" color="white">
          © 2024, Cửa Hàng Gaming Gear & Laptop. Tất cả các quyền được bảo lưu.
        </Typography>
      </Box>

      {/* Liên kết chính sách */}
      <Box sx={{ textAlign: "center" }}>
        <Link
          href="#"
          color="inherit"
          underline="hover"
          sx={{ marginRight: 2 }}
        >
          Điều khoản dịch vụ
        </Link>
        <Link
          href="#"
          color="inherit"
          underline="hover"
          sx={{ marginRight: 2 }}
        >
          Chính sách bảo mật
        </Link>
        <Link href="#" color="inherit" underline="hover">
          Chính sách hoàn tiền
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
