import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

import axiosInstance from "../authentication/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, logout } from "../redux/authSlice";
import { setLanguage } from "../redux/languageSlice";
import translations from "../redux/data/translations";
const apiUrl = process.env.REACT_APP_URL_SERVER;
const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [infoUser, setInfoUser] = useState("");

  //redux
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);
  const t = translations[language].header;
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const [optionLanguage, setOptionLanguage] = useState("vi");
  const handleChangeLanguage = (lang) => {
    setOptionLanguage(lang);
    dispatch(setLanguage(lang));
  };
  useEffect(() => {
    const fetchProfileUser = async () => {
      const token = Cookies.get("accessToken");

      if (token) {
        const decode = jwtDecode(token);
        try {
          const response = await axiosInstance.post(`${apiUrl}/api/v1/KhachHang/xem/thongtin`, {
            ID_USER: decode.ID_USER,
          });
          if (response.data.EC === 1) {
            setInfoUser(response.data.DT);
            dispatch(setUserInfo(response.data.DT));
          }

          console.log("response", response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchProfileUser();
  }, []);
  const handleMenu = (event) => {
    const token = Cookies.get("accessToken");
    if (isAuthenticated && token) {
      setAnchorEl(event.currentTarget);
    } else {
      navigate("/login");
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post(`${apiUrl}/api/v1/admin/taikhoan/logout`);
      navigate("/login");
      Cookies.remove("accessToken");

      // Cập nhật Redux bằng cách dispatch hành động logout
      dispatch(logout());
      handleClose();
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };
  const [anchorElLanguage, setAnchorElLanguage] = useState(null);

  const handleLanguageMenu = (event) => {
    setAnchorElLanguage(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorElLanguage(null);
  };

  const menuItems = (
    <>
      {" "}
      <Button
        color="inherit"
        component={Link}
        to="/profile/ho-tro"
      >
        Hỗ trợ
      </Button>
      <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>

      </Box>
      <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
        <Typography
          onClick={handleMenu}
          variant="body1"
          component="span"
          sx={{
            ml: 1,
            cursor: "pointer",
            color: `${userInfo?.ID_ROLE === 1 ? "red" : "white"}`,
          }}
        >
          {isAuthenticated ? <div>{userInfo?.LASTNAME}</div> : <></>}
        </Typography>{" "}
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          {isAuthenticated ? (
            // Nếu người dùng đã đăng nhập, hiển thị avatar
            <Avatar
              src={`${apiUrl}/images/${userInfo?.AVATAR}`}
              alt="user avatar"
            />
          ) : (
            // Nếu chưa đăng nhập, hiển thị icon AccountCircle
            <AccountCircle />
          )}
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              backgroundColor: "#29292d",
              borderRadius: "13px",
              paddingTop: 2,
              paddingBottom: 2,
              paddingRight: 8,
              paddingLeft: 2,
            },
          }}
        >
          <MenuItem
            sx={{
              borderRadius: "8px",
              paddingTop: 1,
              paddingBottom: 1,
              paddingRight: 8,
              paddingLeft: 2,
              color: "#fff",
              "&:hover": {
                backgroundColor: "#3ccaff", // Màu nền khi hover
                color: "#000",
              },
            }}
            component={Link}
            to="/profile"
            onClick={handleClose}
          >
            Thông tin
          </MenuItem>
          <MenuItem
            sx={{
              borderRadius: "8px",
              paddingTop: 1,
              paddingBottom: 1,
              paddingRight: 8,
              paddingLeft: 2,
              color: "#fff",
              "&:hover": {
                backgroundColor: "#3ccaff", // Màu nền khi hover
                color: "#000",
              },
            }}
            onClick={handleClose}
            component={Link}
            to="/profile/mat-khau-cai-dat"
          >
            Mật khẩu & cài đặt
          </MenuItem>{" "}
          {infoUser?.ID_ROLE === 1 ? (
            <>
              {" "}
              <MenuItem
                sx={{
                  borderRadius: "8px",
                  paddingTop: 1,
                  paddingBottom: 1,
                  paddingRight: 8,

                  paddingLeft: 2,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#3ccaff",
                    color: "#000",
                  },
                }}
                onClick={handleClose}
                component={Link}
                to="/admin"
              >
                Admin
              </MenuItem>{" "}
            </>
          ) : (
            false
          )}
          <MenuItem
            sx={{
              borderRadius: "8px",
              paddingTop: 1,
              paddingBottom: 1,
              paddingRight: 8,
              paddingLeft: 2,
              color: "#fff",
              "&:hover": {
                backgroundColor: "#3ccaff", // Màu nền khi hover
                color: "#000",
              },
            }}
            onClick={() => {
              handleLogout();
            }}
          >
            Đăng xuất
          </MenuItem>
        </Menu>
      </Box>
    </>
  );

  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "#101014", zIndex: 20 }}
    >
      <Toolbar>
        <Box
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none", color: "#fff", flexGrow: 1 }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Kho hàng
          </Typography>{" "}
        </Box>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open mobile menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMoreAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(mobileMoreAnchorEl)}
              onClose={handleMobileMenuClose}
            >
              <MenuItem onClick={handleMobileMenuClose}>Support</MenuItem>
              <MenuItem onClick={handleMobileMenuClose}>Distribute</MenuItem>
              <MenuItem onClick={handleMobileMenuClose}>
                <LanguageIcon sx={{ marginRight: 1 }} />
                Language
              </MenuItem>
              <MenuItem onClick={handleMenu}>
                <AccountCircle sx={{ marginRight: 1 }} />
                Minurte1
              </MenuItem>
              <MenuItem onClick={handleMobileMenuClose}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#00aaff" }}
                >
                  Download
                </Button>
              </MenuItem>
            </Menu>
          </>
        ) : (
          menuItems
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
