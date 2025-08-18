import React, { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Divider,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const PasswordAndSetting = () => {
  const apiUrl = process.env.REACT_APP_URL_SERVER;
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);

  //change password
  const [isOpenOTP, setIsOpenOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword) {
      try {
        const response = await axios.post(`${apiUrl}/api/v1/KhachHang/update-password`, {
          email: userInfo.EMAIL,
          newPassword: newPassword,
        });
        if (response.data.EC == 1) {
          enqueueSnackbar(response.data.EM);
          setIsOpenChangePassword(false);
        } else {
          enqueueSnackbar(response.data.EM);
        }
      } catch (error) { }
    } else {
      enqueueSnackbar("Mật khẩu không trùng khớp với nhau!! ");
    }
  };

  return (
    <>
      <Box
        display="flex"
        sx={{ textAlign: "left" }}
        style={{
          minHeight: "100vh",
          backgroundColor: "#101014",
          color: "#fff",
          flexDirection: "column", // Thêm để căn dọc
          padding: "16px", // Tạo khoảng cách
        }}
      >
        <Typography variant="h5" className="text-white">
          Mật khẩu & cài đặt
        </Typography>
        <Divider sx={{ my: 2, backgroundColor: "#ffffff" }} />
        <Box
          sx={{
            width: "600px", // Giới hạn độ rộng

            textAlign: "left", // Căn giữa nội dung
          }}
        >
          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
            }}
          >
            <Box>
              <Button
                variant="text"
                onClick={() => setIsOpenOTP(!isOpenOTP)}
                sx={{ color: "#ffffff", width: "100%" }}
              >
                Thay đổi mật khẩu
              </Button>
            </Box>
            {/* {isOpenOTP ? ( */}
            <>
              {" "}
              <Box>
                <form onSubmit={handleUpdatePassword}>
                  <TextField
                    label="New Password"
                    variant="outlined"
                    sx={{
                      color: "#c9d1d9", // Text color for input value
                      width: "100%",
                      "& .MuiInputBase-input": {
                        color: "#c9d1d9",
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#c9d1d9", // Placeholder color
                      },
                      "& .MuiOutlinedInput-root fieldset": {
                        borderColor: "#c9d1d9", // Border color when not focused
                      },
                      "& .Mui-focused .MuiInputLabel-root": {
                        color: "#c9d1d9", // Focused label color
                      },
                      "& .MuiInputLabel-root": {
                        color: "#c9d1d9", // Default label color
                      },
                    }}
                    type="password"
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ marginBottom: 20 }}
                  />{" "}
                  <TextField
                    label="Confirm New Password"
                    variant="outlined"
                    sx={{
                      color: "#c9d1d9", // Text color for input value
                      width: "100%",
                      "& .MuiInputBase-input": {
                        color: "#c9d1d9",
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#c9d1d9", // Placeholder color
                      },
                      "& .MuiOutlinedInput-root fieldset": {
                        borderColor: "#c9d1d9", // Border color when not focused
                      },
                      "& .Mui-focused .MuiInputLabel-root": {
                        color: "#c9d1d9", // Focused label color
                      },
                      "& .MuiInputLabel-root": {
                        color: "#c9d1d9", // Default label color
                      },
                    }}
                    fullWidth
                    value={confirmNewPassword}
                    onChange={(e) =>
                      setConfirmNewPassword(e.target.value)
                    }
                    style={{ marginBottom: 20 }}
                    type="password"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    sx={{
                      backgroundColor: "#ffffff", // Màu nền trắng
                      color: "#101014", // Màu chữ
                    }}
                  >
                    Cập nhật mật khẩu
                  </Button>
                </form>
              </Box>
            </>
            {/* ) : (
              <></>
            )} */}
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default PasswordAndSetting;
