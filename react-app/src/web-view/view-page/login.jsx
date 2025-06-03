import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { enqueueSnackbar } from "notistack";
import { getThemeConfig } from "../../service/themeService";

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const [tokenGoogle, setTokenGoogle] = useState(null);
  const currentTheme = getThemeConfig(localStorage.getItem("THEMES") || "dark");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setTokenGoogle(tokenResponse.access_token);

      // Lấy thông tin người dùng từ Google API
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        setUser(userInfo.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  useEffect(() => {
    if (user) {
      console.log("check user =>", user.email);
      const fetchData = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/admin/taikhoan/dangnhapgoogle`,
            { TEN_DANG_NHAP: user.email, TEN_KHACH_HANG: user.name }
          );
          console.log("check token =>", response.data);

          if (response.data.EC === 200) {
            // localStorage.setItem("THEMES", response.data.DT.userInfo.THEMES);
            Cookies.remove("accessToken");
            const accessToken = response.data.DT.accessToken;
            Cookies.set("accessToken", accessToken, { expires: 7 });
            sessionStorage.setItem("userPicture", user.picture);
            dispatch(
              login({
                accessToken,
                userInfo: response.data.DT.userInfo, // Thông tin người dùng
              })
            );
            enqueueSnackbar(response.data.EM);
            // loginIs();
            navigate("/");
          } else {
            enqueueSnackbar(response.data.EM, { variant: "info" });
          }
        } catch (error) {
          console.error("Đã xảy ra lỗi:", error);

          enqueueSnackbar(error.response.data.EM, { variant: "info" });
        }
      };

      fetchData();
    }
  }, [user, navigate, dispatch]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      enqueueSnackbar("Please fill in all fields");
      return;
    }
    setLoading(true); // Bắt đầu loading

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/admin/taikhoan/dangnhap`,
        { email, password }
      );
      console.log("Response:", response.data);

      if (response.data.EC === 1) {
        Cookies.remove("accessToken");
        const accessToken = response.data.DT.accessToken;
        Cookies.set("accessToken", accessToken, { expires: 7 });
        // localStorage.setItem("THEMES", response.data.DT.userInfo.THEMES);

        // Cập nhật trạng thái người dùng trong Redux
        dispatch(
          login({
            accessToken,
            userInfo: response.data.DT.userInfo, // Thông tin người dùng
          })
        );

        enqueueSnackbar(response.data.EM);
        navigate("/");
      } else {
        enqueueSnackbar(response.data.EM);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      enqueueSnackbar(
        error.response?.data?.EM || "Có lỗi xảy ra, vui lòng thử lại."
      );
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Full height
        backgroundColor: currentTheme.backgroundColorLow,
        padding: 2, // Thêm padding cho màn hình nhỏ
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: currentTheme.backgroundColor,
          color: currentTheme.color,
          width: { xs: "100%", sm: "80%", md: "450px" }, // Responsive width
          maxWidth: "500px",
          padding: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <img
          src={`https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg`}
          alt="Epic Games Logo"
          style={{
            marginBottom: 20,
            maxWidth: "60px",
            height: "auto",
            // filter: "drop-shadow(1px 4px 3.5px rgb(38, 187, 255,0.9))",
          }}
        />

        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Sign In
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ style: { color: currentTheme.color } }}
            inputProps={{ style: { color: currentTheme.color } }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ style: { color: currentTheme.color } }}
            inputProps={{ style: { color: currentTheme.color } }}
          />

          <Typography
            to="/forget-password"
            component={Link}
            variant="body2"
            sx={{
              color: currentTheme.color,
              cursor: "pointer",
              marginBottom: 2,
              textDecoration: "none",
            }}
          >
            Forgot password?
          </Typography>

          <Button
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              backgroundColor: "#26bbff",
              color: "#101014",
              borderRadius: "14px",
              width: "100%",
              padding: "10px",
              fontWeight: "600",
            }}
            disabled={loading} // Disable button khi đang loading
          >
            {loading ? "Loading..." : "SIGN IN"}
          </Button>
        </form>

        <Typography
          variant="body2"
          sx={{ margin: "20px 0", color: currentTheme.color }}
        >
          or sign in with
        </Typography>

        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {["Google"].map((platform) => (
            <Grid item key={platform} xs={4} sm={3} md={4}>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "14px",
                  paddingLeft: 4,
                  paddingRight: 4,
                  paddingTop: 2,
                  paddingBottom: 2,

                  width: "100%",
                  fontSize: { xs: "0.75rem", md: "0.875rem" }, // Responsive font size
                }}
                onClick={
                  platform === "Google" ? () => loginGoogle() : undefined
                }
              >
                <i
                  className="ml-4 fa-brands fa-google"
                  style={{ marginRight: "8px" }}
                ></i>{" "}
                {platform}{" "}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Link to="/register" style={{ textDecoration: "none" }}>
          <Typography
            variant="body2"
            sx={{ marginTop: 3, color: currentTheme.color }}
          >
            Create account
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default LoginPage;
