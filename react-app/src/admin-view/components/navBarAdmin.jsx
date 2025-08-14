import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse, // Đừng quên import Collapse
} from "@mui/material";
import IconUuTien from "@mui/icons-material/KeyboardDoubleArrowUp";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People"; // Quản lý người dùng
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Quản lý đơn hàng
import InventoryIcon from "@mui/icons-material/Inventory"; // Quản lý sản phẩm
import GroupIcon from "@mui/icons-material/Group"; // Tương tác người dùng
import ExpandLess from "@mui/icons-material/ExpandLess"; // Import đúng từ đây
import ExpandMore from "@mui/icons-material/ExpandMore"; // Import đúng từ đây

import { Link, useLocation } from "react-router-dom";
const NavBarAdmin = () => {
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };
  const [openCategory, setOpenCategory] = useState(false);

  const handleClick = () => {
    setOpenCategory(!openCategory);
  };
  return (
    <>
      {" "}
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#0d1117",
          padding: "30px 20px",
          borderRight: "1px solid #ddd",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "1px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#0d1117",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Typography
          variant="h6"
          style={{
            marginBottom: "20px",
            color: "#fff",
          }}
        >
          Quản lý hệ thống
        </Typography>
        <List component="nav">
          <ListItem
            button
            component={Link}
            to="/admin/"
            sx={{
              borderRadius: "12px",
              color: "#f0f6fc",
              cursor: "pointer",
              userSelect: "none",
              backgroundColor:
                location.pathname === "/admin" ? "#3c3f41" : "transparent", // Kiểm tra nếu đang ở trang này
              "&:hover": { backgroundColor: "#3c3f41" },
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon sx={{ color: "#f0f6fc" }} />
            </ListItemIcon>
            <ListItemText primary="Thống kê doanh thu" />
          </ListItem>
          {/* //----------------------- */}
          <List>
            {/* Quản lý người dùng */}
            <ListItem
              button
              onClick={() => toggleSection("nguoiDung")}
              sx={{
                borderRadius: "12px",
                color: "#f0f6fc",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <ListItemIcon>
                <PeopleIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Quản lý người dùng" />
              {openSection === "nguoiDung" ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openSection === "nguoiDung"}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <ListItem
                  button
                  component={Link}
                  to="/admin/quanlykhachhang"
                  sx={{
                    borderRadius: "12px",
                    pl: 4,
                    color: "#f0f6fc",
                    cursor: "pointer",
                    userSelect: "none",
                    backgroundColor:
                      location.pathname === "/admin/nguoi-dung/danh-sach"
                        ? "#3c3f41"
                        : "transparent", // Kiểm tra nếu đang ở trang này
                    "&:hover": { backgroundColor: "#3c3f41" },
                  }}
                >
                  <ListItemText primary="Danh sách người dùng" />
                </ListItem>
              </List>
            </Collapse>

            {/* Quản lý sản phẩm */}
            <ListItem
              button
              onClick={() => toggleSection("sanPham")}
              sx={{
                borderRadius: "12px",
                color: "#f0f6fc",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <ListItemIcon>
                <InventoryIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Quản lý sản phẩm" />
              {openSection === "sanPham" ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openSection === "sanPham"}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <ListItem
                  button
                  component={Link}
                  to="/admin/quanlysanpham"
                  sx={{ pl: 4, color: "#f0f6fc" }}
                ></ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/admin/quanlysanpham"
                  sx={{ pl: 4, color: "#f0f6fc" }}
                >
                  <ListItemText primary="Thêm sản phẩm" />
                </ListItem>{" "}
                <ListItem
                  button
                  component={Link}
                  to="/admin/sanpham-uutien"
                  sx={{ pl: 4, color: "#f0f6fc" }}
                >
                  <ListItemText primary="Carousel Sản Phẩm" />
                </ListItem>
                <List>
                  <ListItem
                    button
                    to="/admin/quanlytheloai"
                    component={Link}
                    onClick={handleClick}
                    sx={{ pl: 4, color: "#f0f6fc" }}
                  >
                    <ListItemText
                      primary="Thể loại sản phẩm"
                      sx={{
                        borderRadius: "12px",
                        color: "#f0f6fc",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    />
                  </ListItem>
                </List>
              </List>
            </Collapse>

            {/* Quản lý đơn hàng */}
            <ListItem
              button
              onClick={() => toggleSection("donHang")}
              sx={{ color: "#f0f6fc" }}
            >
              <ListItemIcon>
                <ShoppingCartIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Quản lý đơn hàng" />
              {openSection === "donHang" ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openSection === "donHang"}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <ListItem
                  button
                  component={Link}
                  to="/admin/don-hang-dang-xu-ly"
                  sx={{ pl: 4, color: "#f0f6fc" }}
                >
                  <ListItemText primary="Đang chờ xác nhận" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/admin/don-hang-giao-dich-thanh-cong"
                  sx={{ pl: 4, color: "#f0f6fc" }}
                >
                  <ListItemText primary="Lịch sử đơn hàng" />
                </ListItem>{" "}
                <ListItem
                  button
                  component={Link}
                  to="/admin/quanlythanhtoan"
                  sx={{ pl: 4, color: "#f0f6fc" }}
                >
                  <ListItemText primary="Phương Thức Thanh Toán" />
                </ListItem>
              </List>
            </Collapse>
          </List>
          {/* //----------------------- */}
          <Divider style={{ margin: "20px 0" }} />
          <Typography
            variant="body2"
            style={{ color: "#888", textAlign: "center" }}
          >
            NEED HELP?
          </Typography>
        </List>
      </Box>{" "}
    </>
  );
};

export default NavBarAdmin;
