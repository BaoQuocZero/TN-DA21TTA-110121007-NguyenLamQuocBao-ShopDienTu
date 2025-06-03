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

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReplayIcon from "@mui/icons-material/Replay";
import { useTheme } from "@mui/material/styles";

import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, logout } from "../../redux/authSlice";
import { setLanguage } from "../../redux/languageSlice";
import translations from "../../redux/data/translations";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const PasswordAndSetting = () => {
  const [optionLanguage, setOptionLanguage] = useState("vi");
  const apiUrl = process.env.REACT_APP_URL_SERVER;
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const [themesWeb, setThemesWeb] = useState(userInfo?.THEMES);

  //api change backgroundColor

  useEffect(() => {
    if (themesWeb) {
      changeThemseWeb();
    }
  }, [themesWeb]);

  const changeThemseWeb = async () => {
    try {
      const response = await axios.post(`${apiUrl}/update-preferences`, {
        ID_NGUOI_DUNG: userInfo.ID_NGUOI_DUNG,
        THEMES: themesWeb,
      });
      if (response.status === 200) {
        console.log("Language updated successfully");
      } else {
        console.error("Failed to update language");
      }
    } catch (error) {
      console.error("Error while updating language:", error);
    }
  };
  //api change language
  const handleChangeLanguage = async (lang) => {
    setOptionLanguage(lang);
    dispatch(setLanguage(lang));

    // Gửi yêu cầu API
    try {
      const response = await axios.post(`${apiUrl}/update-language`, {
        ID_NGUOI_DUNG: userInfo.ID_NGUOI_DUNG,
        LANGUAGE: lang,
      });
      if (response.status === 200) {
        console.log("Language updated successfully");
      } else {
        console.error("Failed to update language");
      }
    } catch (error) {
      console.error("Error while updating language:", error);
    }
  };

  //languages
  const [anchorElLanguage, setAnchorElLanguage] = useState(null);
  const handleLanguageMenu = (event) => {
    setAnchorElLanguage(event.currentTarget);
  };
  const handleLanguageClose = () => {
    setAnchorElLanguage(null);
  };

  //themes
  const [anchorElTheme, setAnchorElTheme] = React.useState(null);
  const handleThemeMenu = (event) => {
    setAnchorElTheme(event.currentTarget);
  };
  const handleThemeClose = () => {
    setAnchorElTheme(null);
  };

  //change password
  const [isOpenOTP, setIsOpenOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);

  const [countdown, setCountdown] = useState(0); // State to track countdown time
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sent status

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword) {
      try {
        const response = await axios.post(`${apiUrl}/update-password`, {
          email: userInfo.EMAIL,
          newPassword: newPassword,
        });
        if (response.data.EC == 1) {
          enqueueSnackbar(response.data.EM);
          setCountdown(0);
          setIsOpenChangePassword(false);
          setOtp("");
        } else {
          enqueueSnackbar(response.data.EM);
        }
      } catch (error) {}
    } else {
      enqueueSnackbar("Mật khẩu không trùng khớp với nhau!! ");
    }
  };

  // Handle OTP send
  const handleSendOtp = async () => {
    if (countdown > 0) return; // Prevent sending OTP if countdown is active

    try {
      const response = await axios.post(`${apiUrl}/send-otp`, {
        email: userInfo.EMAIL,
      });
      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM);
        setCountdown(60); // Set countdown to 60 seconds
        setIsOtpSent(true); // Mark OTP as sent
      } else {
        enqueueSnackbar(response.data.EM);
      }
    } catch (error) {}
  };
  //handle Check OTP
  const handleCheckOtp = async () => {
    try {
      const response = await axios.post(`${apiUrl}/check-otp`, {
        email: userInfo.EMAIL,
        otp: otp,
      });
      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM);
        setIsOtpSent(false);
        setIsOpenChangePassword(true);
      } else {
        enqueueSnackbar(response.data.EM);
      }
    } catch (error) {}
  };
  // Start countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsOtpSent(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);
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
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Căn giữa theo trục dọc
              gap: 2, // Khoảng cách giữa các phần tử
            }}
          >
            {" "}
            <Button variant="text" sx={{ color: "#ffffff" }}>
              Thay đổi ngôn ngữ
            </Button>
            <Button
              variant="outlined"
              onClick={handleLanguageMenu}
              sx={{
                backgroundColor: "#ffffff", // Màu nền trắng
                color: "#101014", // Màu chữ
              }}
            >
              {optionLanguage === "vi"
                ? "Tiếng Việt"
                : optionLanguage === "en"
                ? "English"
                : "Español"}{" "}
              <ArrowDropDownIcon />
            </Button>
          </Box>
          <Box
            sx={{
              mt: 4,

              display: "flex",
              alignItems: "center", // Căn giữa theo trục dọc
              gap: 2, // Khoảng cách giữa các phần tử
            }}
          >
            {" "}
            <Button variant="text" sx={{ color: "#ffffff" }}>
              Thay đổi màu nền
            </Button>
            <Box sx={{ ml: 1 }}>
              <Button
                variant="outlined"
                onClick={handleThemeMenu}
                sx={{
                  backgroundColor: `${
                    themesWeb === "dark" ? "#ffffff" : "#101014"
                  }`, // Màu nền trắng
                  color: "#101014", // Màu chữ
                  textTransform: "none", // Giữ nguyên chữ thường
                }}
              >
                {themesWeb === "dark" ? "Nền đen" : "Nền trắng"}{" "}
                <ArrowDropDownIcon />
              </Button>
              <Menu
                id="theme-menu"
                anchorEl={anchorElTheme}
                open={Boolean(anchorElTheme)}
                onClose={handleThemeClose}
                PaperProps={{
                  sx: {
                    backgroundColor: "#29292d",
                    borderRadius: "13px",
                    paddingTop: 1,
                    paddingBottom: 1,
                  },
                }}
              >
                <MenuItem
                  sx={{
                    color: "#fff",
                    "&:hover": { backgroundColor: "#4a494c" },
                  }}
                  onClick={() => {
                    setThemesWeb("dark");
                    handleThemeClose();
                  }}
                >
                  Nền đen
                </MenuItem>
                <MenuItem
                  sx={{
                    color: "#fff",
                    "&:hover": { backgroundColor: "#4a494c" },
                  }}
                  onClick={() => {
                    setThemesWeb("light");
                    handleThemeClose();
                  }}
                >
                  Nền trắng
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              // alignItems: "center", // Căn giữa theo trục dọc
              gap: 2, // Khoảng cách giữa các phần tử
            }}
          >
            <Box
              sx={
                {
                  // width: "250px",
                }
              }
            >
              <Button
                variant="text"
                onClick={() => setIsOpenOTP(!isOpenOTP)}
                sx={{ color: "#ffffff", width: "100%" }}
              >
                Thay đổi mật khẩu
              </Button>
            </Box>
            {isOpenOTP ? (
              <>
                {" "}
                <Box>
                  <form onSubmit={handleUpdatePassword}>
                    {" "}
                    {isOpenChangePassword ? (
                      <>
                        {" "}
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
                      </>
                    ) : (
                      <>
                        <TextField
                          label="OTP"
                          variant="outlined"
                          fullWidth
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
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          style={{ marginBottom: 20 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleSendOtp}
                                  disabled={countdown > 0}
                                >
                                  <ReplayIcon sx={{ color: "#c9d1d9" }} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{ color: "#ffffff", textAlign: "right" }}
                        >
                          {countdown > 1 ? `${countdown}s` : ""}
                        </Typography>
                        <Button
                          onClick={handleCheckOtp}
                          variant="contained"
                          color="primary"
                          fullWidth
                          type="submit"
                        >
                          Xác nhận
                        </Button>
                      </>
                    )}
                  </form>
                </Box>
              </>
            ) : (
              <></>
            )}
          </Box>
          <Menu
            id="language-menu"
            anchorEl={anchorElLanguage}
            open={Boolean(anchorElLanguage)}
            onClose={handleLanguageClose}
            PaperProps={{
              sx: {
                backgroundColor: "#29292d",
                borderRadius: "13px",
                paddingTop: 1,
                paddingBottom: 1,
              },
            }}
          >
            <MenuItem
              sx={{ color: "#fff", "&:hover": { backgroundColor: "#4a494c" } }}
              onClick={() => {
                handleChangeLanguage("vi");
                handleLanguageClose();
              }}
            >
              Tiếng Việt
            </MenuItem>
            <MenuItem
              sx={{ color: "#fff", "&:hover": { backgroundColor: "#4a494c" } }}
              onClick={() => {
                handleChangeLanguage("en");
                handleLanguageClose();
              }}
            >
              English
            </MenuItem>
            <MenuItem
              sx={{ color: "#fff", "&:hover": { backgroundColor: "#4a494c" } }}
              onClick={() => {
                handleChangeLanguage("es");
                handleLanguageClose();
              }}
            >
              Español
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </>
  );
};
export default PasswordAndSetting;
