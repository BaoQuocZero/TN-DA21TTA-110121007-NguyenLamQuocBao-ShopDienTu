import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import translations from "../../redux/data/translations";
import { useSelector } from "react-redux";
const NavBarUser = () => {
  const language = useSelector((state) => state.language.language);
  const t = translations[language].profile;
  const [isOpenNeedHelp, setIsOpenNeedHelp] = useState(false);
  return (
    <Box
      sx={{
        width: "250px",
        backgroundColor: "#0d1117",
        padding: "20px",
        borderRight: "1px solid #ddd",
        position: "fixed", // Cố định thanh điều hướng
        top: 0,
        left: 0,
        height: "100vh", // Chiều cao 100% của viewport
        overflowY: "auto", // Cho phép cuộn khi nội dung vượt quá chiều cao
      }}
    >
      <Typography variant="h6" style={{ marginBottom: "20px", color: "#fff" }}>
        Thông tin
      </Typography>
      <List component="nav">
        <ListItem
          button
          component={Link}
          to="/profile"
          sx={{ color: "#f0f6fc" }}
        >
          <ListItemIcon>
            <AccountCircleIcon sx={{ color: "#f0f6fc" }} />
          </ListItemIcon>
          <ListItemText
            primary={t.UserInfo ? t.UserInfo : "Thông tin người dùng"}
          />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/profile/don-hang"
          sx={{ color: "#f0f6fc" }}
        >
          <ListItemIcon>
            <EmailIcon sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          <ListItemText
            primary={t.LibraryGame ? t.LibraryGame : "Thư viện game"}
          />
        </ListItem>
        {/* <ListItem
        button
        component={Link}
        to="/payment-management"
        sx={{ color: "#f0f6fc" }}
      >
        <ListItemIcon>
          <PaymentIcon sx={{ color: "#ffffff" }} />
        </ListItemIcon>
        <ListItemText primary="Payment Management" />
      </ListItem> */}
        <ListItem
          button
          component={Link}
          to="/profile/mat-khau-cai-dat"
          sx={{ color: "#f0f6fc" }}
        >
          <ListItemIcon>
            <LockIcon sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          <ListItemText
            primary={
              t.PasswordAndSetting ? t.PasswordAndSetting : "Mật khẩu & cài đặt"
            }
          />
        </ListItem>
        {/* <ListItem
        button
        component={Link}
        to="/epic-rewards"
        sx={{ color: "#f0f6fc" }}
      >
        <ListItemIcon>
          <StarIcon sx={{ color: "#fff" }} />
        </ListItemIcon>
        <ListItemText primary="Epic Rewards" />
      </ListItem> */}
        <Divider style={{ margin: "20px 0" }} />
        <Typography
          onClick={() => setIsOpenNeedHelp(!isOpenNeedHelp)}
          variant="body2"
          style={{ color: "#888", textAlign: "center", cursor: "pointer" }}
        >
          {t.NeedHelp ? t.NeedHelp : "BẠN CẦN GIÚP ĐỠ?"}
        </Typography>
        {isOpenNeedHelp ? (
          <>
            {" "}
            <Typography
              mt={4}
              onClick={() => setIsOpenNeedHelp(!isOpenNeedHelp)}
              variant="body2"
              style={{ color: "#888", textAlign: "center", cursor: "pointer" }}
            >
              Kệ bạn =)))
            </Typography>
          </>
        ) : (
          <></>
        )}
      </List>
    </Box>
  );
};

export default NavBarUser;
