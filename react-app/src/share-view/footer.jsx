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
      sx={{ backgroundColor: "#1a1a1a", color: "white", padding: "40px 20px" }}
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

      {/* Liên kết tài nguyên */}
      <Grid container spacing={4} justifyContent="center" textAlign="center">
        <Grid item xs={6} sm={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Tài Nguyên
          </Typography>
          <Box>
            <Link href="#" color="inherit" underline="hover">
              Hỗ trợ người sáng tạo
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Phân phối trên Epic Games
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Cơ hội nghề nghiệp
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Công ty
            </Link>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box>
            <Link href="#" color="inherit" underline="hover">
              Chính sách Fan Art
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Nghiên cứu UX
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Điều khoản EULA của cửa hàng
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Dịch vụ trực tuyến
            </Link>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box>
            <Link href="#" color="inherit" underline="hover">
              Quy tắc cộng đồng
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Phòng tin tức Epic
            </Link>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Sản Xuất Bởi Epic Games
          </Typography>
          <Box>
            <Link href="#" color="inherit" underline="hover">
              Battle Breakers
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Fortnite
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Infinity Blade
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Robo Recall
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Shadow Complex
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Unreal Tournament
            </Link>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ backgroundColor: "#444", marginY: 4 }} />

      {/* Phần bản quyền */}
      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        <Typography variant="body2" color="white">
          © 2024, Epic Games, Inc. Tất cả các quyền được bảo lưu. Epic, Epic
          Games, logo Epic Games, Fortnite, logo Fortnite, Unreal, Unreal
          Engine, và Unreal Tournament là nhãn hiệu hoặc nhãn hiệu đã đăng ký
          của Epic Games, Inc. tại Hoa Kỳ và các quốc gia khác.
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
          Chính sách hoàn tiền cửa hàng
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
