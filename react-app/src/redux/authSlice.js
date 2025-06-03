import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const token = Cookies.get("accessToken");

const initialState = {
  isAuthenticated: !!Cookies.get("accessToken"),
  accessToken: Cookies.get("accessToken") || null,
  userInfo: token ? jwtDecode(token) : null,
  totalCart: 0, // Thêm state cho tổng tiền trong giỏ hàng
  itemCart: [], // Thêm state cho các items trong giỏ hàng
  IdOder: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;

      // Kết hợp dữ liệu userInfo cũ với dữ liệu mới
      state.userInfo = {
        ...state.userInfo, // Dữ liệu cũ
        ...action.payload.userInfo, // Dữ liệu mới
      };

      Cookies.set("accessToken", action.payload.accessToken, { expires: 7 });
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.userInfo = null;
      state.itemCart = []; // Xóa giỏ hàng khi logout
      Cookies.remove("accessToken");
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setTotalCart: (state, action) => {
      state.totalCart = action.payload; // Cập nhật tổng tiền giỏ hàng
    },
    setItemCart: (state, action) => {
      state.itemCart = action.payload; // Cập nhật giỏ hàng
    },
    setIdOder: (state, action) => {
      state.IdOder = action.payload; // Cập nhật giỏ hàng
    },
  },
});

export const {
  login,
  logout,
  setUserInfo,
  setTotalCart,
  setItemCart,
  setIdOder,
} = authSlice.actions;
export default authSlice.reducer;
