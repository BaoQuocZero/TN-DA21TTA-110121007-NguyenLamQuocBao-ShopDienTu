import React, { useState, useEffect } from "react";
import axios from "axios";

import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode trực tiếp thay vì từ jwt-decode

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { useAuth } from "../AuthContext";
const LoginGoogle = () => {
  const [user, setUser] = useState(null);
  const [tokenGoogle, setTokenGoogle] = useState(null);
  const navigate = useNavigate();
  // const { loginIs } = useAuth();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Token Response:", tokenResponse);
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
        console.log("User Info:", userInfo.data);
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
            "http://localhost:3002/api/users/login/google",
            { email: user.email }
          );
          console.log("check token =>", response.data);

          if (response.data.EC === 200) {
            // Xóa token cũ và lưu token mới nếu đăng nhập thành công
            Cookies.remove("accessToken");
            const accessToken = response.data.DT.accessToken;
            Cookies.set("accessToken", accessToken, { expires: 7 });
            sessionStorage.setItem("userPicture", user.picture);
            toast.success(response.data.EM);
            // loginIs();
            navigate("/");
          } else {
            toast.error(response.data.EM);
          }
        } catch (error) {
          console.error("Đã xảy ra lỗi:", error);

          toast.error(error.response.data.EM);
        }
      };

      fetchData();
    }
  }, [user, navigate]);

  return (
    <div className="admin-login">
      <div>
        <button className="btn btn-primary btn-cus" onClick={() => login()}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginGoogle;
