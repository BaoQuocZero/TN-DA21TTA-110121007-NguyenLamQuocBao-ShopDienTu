import React, { useState, useRef } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';

import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Paper,
  InputAdornment,
} from "@mui/material";

import dayjs from "dayjs";
const RegistrationForm = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpenThongTinUser, setIsOpenThongTinUser] = useState(true);
  const scrollRef = useRef(null); // Tạo ref cho phần tử cuộn tới
  const [infoUser, setInfoUser] = useState({
    EMAIL: "",
    FIRSTNAME: "",
    LASTNAME: "",
    PHONENUMBER: "",
    ADDRESS: "",
    PASSWORD: "",
  });
  const isOver18 = (dateOfBirth) => {
    const age = dayjs().diff(dayjs(dateOfBirth), "year");
    return age >= 18;
  };
  const handleOpenThongTinUser = () => {
    if (!isOpenThongTinUser) {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: "smooth", // Cuộn mượt mà
          block: "center", // Cuộn tới giữa màn hình
        });
      }
    }
    if (selectedDate && isOver18(selectedDate)) {
      console.log("selectedDate", selectedDate);
      setIsOpenThongTinUser(!isOpenThongTinUser);
    } else {
      alert("Bạn phải trên 18 tuổi để tạo tài khoản.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfoUser({
      ...infoUser,
      [name]: value,  // Cập nhật giá trị tương ứng với tên trường
    });
  };

  const handleContinue = async () => {
    // console.log("Thông tin người dùng:", infoUser);
    // console.log("Ngày sinh đã chọn:", selectedDate);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/admin/taikhoan/dangky`,
        { infoUser }
      );
      enqueueSnackbar(response.data.EM);
      // Điều hướng đến trang đăng nhập khi thành công
      if (response.data.EC == 1) {  // Giả sử EC = 1 là thành công
        navigate('/login');
      }
    } catch (error) {
      enqueueSnackbar(error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#1c1c1e",
        height: "175vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            backgroundColor: "#101014",
            textAlign: "center",
            color: "#c1c1c1",
          }}
          ref={scrollRef} // Gán ref cho phần tử này
        >
          {" "}
          <h1 style={{ marginBottom: 20 }}>
            <i
              className="fas fa-laptop"
              style={{
                fontSize: "50px",
                color: "#26bbff",
                filter: "drop-shadow(1px 4px 3.5px rgba(38, 187, 255, 0.9))",
              }}
            ></i>
          </h1>{" "}

          <Container
            maxWidth="xs"
            style={{
              marginTop: "50px",
              backgroundColor: "#101014",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="h5"
              style={{ color: "#c1c1c1", textAlign: "center" }}
            >
              Create Account
            </Typography>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel style={{ color: "#c1c1c1" }}>Country</InputLabel>
              <Select
                defaultValue="Vietnam"
                style={{ color: "#c1c1c1", borderColor: "#c1c1c1" }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: "#101014",
                      color: "#c1c1c1",
                    },
                  },
                }}
              >
                <MenuItem value="Vietnam">Vietnam</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Email đăng nhập"
              name="EMAIL"
              value={infoUser.EMAIL}  // Liên kết với state
              onChange={handleChange}  // Cập nhật state khi thay đổi giá trị
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                style: { color: "#c1c1c1" },
              }}
              InputLabelProps={{ style: { color: "#c1c1c1" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#c1c1c1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#26bbff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#26bbff",
                  },
                },
              }}
            />

            <TextField
              label="Tên hiển thị"
              name="FIRSTNAME"
              value={infoUser.FIRSTNAME}  // Liên kết với state
              onChange={handleChange}  // Cập nhật state khi thay đổi giá trị
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{ style: { color: "#c1c1c1" } }}
              InputLabelProps={{ style: { color: "#c1c1c1" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#c1c1c1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#26bbff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#26bbff",
                  },
                },
              }}
            />

            <TextField
              label="Họ"
              name="LASTNAME"
              value={infoUser.LASTNAME}  // Liên kết với state
              onChange={handleChange}  // Cập nhật state khi thay đổi giá trị
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{ style: { color: "#c1c1c1" } }}
              InputLabelProps={{ style: { color: "#c1c1c1" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#c1c1c1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#26bbff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#26bbff",
                  },
                },
              }}
            />

            <TextField
              label="Số điện thoại"
              name="PHONENUMBER"
              value={infoUser.PHONENUMBER}  // Liên kết với state
              onChange={handleChange}  // Cập nhật state khi thay đổi giá trị
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{ style: { color: "#c1c1c1" } }}
              InputLabelProps={{ style: { color: "#c1c1c1" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#c1c1c1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#26bbff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#26bbff",
                  },
                },
              }}
            />

            <TextField
              label="Địa chỉ"
              name="ADDRESS"
              value={infoUser.ADDRESS}  // Liên kết với state
              onChange={handleChange}  // Cập nhật state khi thay đổi giá trị
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{ style: { color: "#c1c1c1" } }}
              InputLabelProps={{ style: { color: "#c1c1c1" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#c1c1c1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#26bbff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#26bbff",
                  },
                },
              }}
            />

            <TextField
              label="Mật khẩu"
              name="PASSWORD"
              value={infoUser.PASSWORD}  // Liên kết với state
              onChange={handleChange}  // Cập nhật state khi thay đổi giá trị
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{ style: { color: "#c1c1c1" } }}
              InputLabelProps={{ style: { color: "#c1c1c1" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#c1c1c1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#26bbff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#26bbff",
                  },
                },
              }}
            />
            {/* <Box display="flex" flexDirection="column" alignItems="start">
              <FormControlLabel
                control={<Checkbox style={{ color: "#c1c1c1" }} />}
                label={
                  <Typography style={{ color: "#c1c1c1" }}>
                    Send me news, surveys and special offers from Epic Games
                  </Typography>
                }
              />
              <FormControlLabel
                control={<Checkbox style={{ color: "#c1c1c1" }} />}
                label={
                  <Typography style={{ color: "#c1c1c1" }}>
                    I have read and agree to the terms of service
                  </Typography>
                }
              />
            </Box> */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ backgroundColor: "#26bbff", color: "#101014" }}
              onClick={handleContinue}  // Gọi hàm handleContinue khi nhấn nút
            >
              Continue
            </Button>

            <Typography
              align="center"
              style={{ color: "#c1c1c1", marginTop: "20px" }}
            >
              Already have an account?{" "}
              <a href="#" style={{ color: "#26bbff" }}>
                Sign In
              </a>
            </Typography>
            <Typography align="center" style={{ color: "#26bbff" }}>
              Privacy Policy
            </Typography>
            {/* <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                backgroundColor: "#26bbff",
                color: "#101014",
                width: "50%",
              }}
              onClick={handleOpenThongTinUser}
            >
              Back
            </Button> */}
          </Container>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationForm;
