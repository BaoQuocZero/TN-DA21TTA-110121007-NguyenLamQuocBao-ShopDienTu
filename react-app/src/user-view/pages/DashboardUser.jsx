import React, { useEffect, useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { login, setTotalCart } from "../../redux/authSlice";
import AddressSelector from "../components/addressUser";
import AvatarChanger from "../components/avatarUser";
import moment from "moment";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getThemeConfig } from "../../service/themeService";

const api = process.env.REACT_APP_URL_SERVER;

const UserProfile = () => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [dataUser, setDataUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dataUser?.NGAY_SINH || null);
  const currentTheme = getThemeConfig(localStorage.getItem("THEMES") || "dark");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWards, setSelectedWards] = useState(null);
  const [selectStreetName, setSelectStreetName] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchDataUser();
  }, []);
  const fetchDataUser = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${api}/api/v1/KhachHang/xem/thongtin`,
        {
          MA_KH: userInfo.MA_KH,
        }
      );

      if (response.data.EC === 1) {
        setDataUser(response.data.DT[0]);
        setCurrentAvatar(response.data.DT[0].AVATAR);
        setSelectedProvince(response.data.DT[0].DIA_CHI_Provinces);
        setSelectedDistrict(response.data.DT[0].DIA_CHI_Districts);
        setSelectedWards(response.data.DT[0].DIA_CHI_Wards);
        setSelectStreetName(response.data.DT[0].DIA_CHI_STREETNAME);
        // Kiểm tra và cập nhật selectedDate
        if (response.data.DT[0].NGAY_SINH) {
          const formattedDate = dayjs(response.data.DT[0].NGAY_SINH);
          if (formattedDate.isValid()) {
            setSelectedDate(formattedDate); // Cập nhật giá trị ngày hợp lệ
          } else {
            setSelectedDate(null); // Nếu không hợp lệ, đặt lại là null
          }
        }
      }
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
      // enqueueSnackbar(error.response.data.EM);
    }
  };
  // Hàm callback để cập nhật avatar mới từ AvatarChanger
  const handleAvatarChange = (newAvatar) => {
    setCurrentAvatar(URL.createObjectURL(newAvatar));
  };

  const handleProfileUpdate = async () => {
    console.log("dataa user", dataUser);
    // Kiểm tra người dùng đã đủ 18 tuổi chưa
    const today = new Date();
    const birthDate = new Date(selectedDate); // selectedDate là ngày sinh đã chọn
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    // Điều kiện kiểm tra độ tuổi
    if (age < 18 || (age === 18 && month < 0)) {
      enqueueSnackbar("Bạn phải đủ 18 tuổi để cập nhật thông tin", {
        variant: "error",
      });
      return; // Ngừng thực hiện tiếp
    }

    // Kiểm tra định dạng số điện thoại (đảm bảo là một chuỗi số hợp lệ)
    const phoneRegex = /^[0-9]{10}$/; // Số điện thoại phải có từ 10 đến 11 chữ số
    if (!phoneRegex.test(dataUser.SDT_KH)) {
      enqueueSnackbar("Số điện thoại không hợp lệ", { variant: "error" });
      return; // Ngừng thực hiện tiếp
    }

    const updatedData = {
      TEN_KHACH_HANG: dataUser.TEN_KHACH_HANG,
      SDT_KH: dataUser.SDT_KH,
      NGAY_SINH: selectedDate,
      DIA_CHI_Provinces: selectedProvince.full_name,
      DIA_CHI_Districts: selectedDistrict.full_name,
      DIA_CHI_Wards: selectedWards.full_name,
      DIA_CHI_STREETNAME: selectStreetName,
      MA_KH: userInfo.MA_KH,
    };

    try {
      const response = await axios.post(
        `${api}/api/v1/KhachHang/sua/thongtin`,
        updatedData
      );
      console.log("response.data.DT[0]", response.data);
      if (response.data.EC === 1) {
        Cookies.remove("accessToken");
        const accessToken = response.data.DT.accessToken;

        Cookies.set("accessToken", accessToken, { expires: 7 });
        dispatch(
          login({
            accessToken, // Token mới
            userInfo: response.data.DT.userInfo, // Thông tin người dùng mới
          })
        );

        enqueueSnackbar("Thông tin đã được cập nhật thành công", {
          variant: "success",
        });
        setDataUser(response.data.DT.userInfo);
      } else {
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
      enqueueSnackbar("Lỗi hệ thống, vui lòng thử lại", { variant: "error" });
    }
  };

  const formattedDate = moment(dataUser?.NGAY_TAO_USER).format(
    "YYYY-MM-DD HH:mm:ss"
  );

  return (
    <Box
      display="flex"
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d1117",
        color: "#fff",
      }}
    >
      <Container
        maxWidth="md"
        style={{
          padding: "40px",
          backgroundColor: "#0d1117", // Nền cho container
          color: "#fff", // Màu chữ
        }}
      >
        <AvatarChanger
          userId={userInfo?.MA_KH}
          currentAvatar={`${api}/images/${currentAvatar}`}
          onAvatarChange={handleAvatarChange}
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            disabled
            value={dataUser?.TEN_DANG_NHAP || ""}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              backgroundColor: "#151b23", // Màu nền của input
              "& .MuiInputLabel-root": { color: "#f0ffff" }, // Màu chữ của label

              "& .MuiInputBase-root.Mui-disabled": {
                "& .MuiInputBase-input.Mui-disabled": {
                  color: "#fff", // Màu chữ của value khi disabled
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3d444d", // Màu viền khi bị disabled
                },
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#fff",
              },
            }}
          />

          <TextField
            label="Họ và tên"
            variant="outlined"
            fullWidth
            value={dataUser?.TEN_KHACH_HANG || ""} // Đảm bảo giá trị mặc định là chuỗi rỗng nếu không có dataUser hoặc EMAIL
            onChange={(e) =>
              setDataUser({ ...dataUser, TEN_KHACH_HANG: e.target.value })
            }
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              backgroundColor: "#151b23", // Màu nền của input
              "& .MuiInputLabel-root": { color: "#f0ffff" }, // Màu chữ của label
              "& .MuiInputBase-input": { color: "#f0ffff" }, // Màu chữ của input
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#3d444d" }, // Màu viền
              },
              "& .MuiInputBase-root": {
                borderRadius: "4px", // Làm tròn góc nếu muốn
              },
              ml: 2,
            }}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <TextField
            label="Số điện thoại"
            variant="outlined"
            value={dataUser?.SDT_KH || ""} // Đảm bảo giá trị mặc định là chuỗi rỗng nếu không có dataUser hoặc EMAIL
            onChange={(e) =>
              setDataUser({ ...dataUser, SDT_KH: e.target.value })
            }
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              backgroundColor: "#151b23", // Màu nền của input
              "& .MuiInputLabel-root": { color: "#f0ffff" }, // Màu chữ của label
              "& .MuiInputBase-input": { color: "#f0ffff" }, // Màu chữ của input
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#3d444d" }, // Màu viền
              },
              "& .MuiInputBase-root": {
                borderRadius: "4px", // Làm tròn góc nếu muốn
              },
            }}
          />{" "}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày sinh"
              value={selectedDate}
              sx={{
                backgroundColor: "#151b23", // Màu nền của input
                "& .MuiInputLabel-root": { color: "#f0ffff" }, // Màu chữ của label
                "& .MuiInputBase-input": { color: "#f0ffff" }, // Màu chữ của input
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#3d444d" }, // Màu viền
                },
                "& .MuiInputBase-root": {
                  borderRadius: "4px", // Làm tròn góc nếu muốn
                },
                ml: 2,
                "& .MuiSvgIcon-root": {
                  color: "#f0ffff", // Màu của icon
                },
                width: "820px",
              }}
              onChange={(newDate) => {
                setSelectedDate(newDate); // Cập nhật giá trị mới
                setDataUser({ ...dataUser, NGAY_SINH: newDate }); // Cập nhật dataUser với giá trị ngày sinh
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    style: { color: "#fff" }, // Màu chữ trong TextField
                  }}
                  InputLabelProps={{
                    style: { color: "#fff" }, // Màu chữ nhãn
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Box>
        <AddressSelector
          selectedProvince={selectedProvince}
          selectedDistrict={selectedDistrict}
          selectedWards={selectedWards}
          //
          setSelectedProvince={setSelectedProvince}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedWards={setSelectedWards}
        />{" "}
        <TextField
          label="Tên đường"
          variant="outlined"
          value={selectStreetName} // Đảm bảo giá trị mặc định là chuỗi rỗng nếu không có dataUser hoặc EMAIL
          fullWidth
          onChange={(e) => setSelectStreetName(e.target.value)}
          InputProps={{
            style: { color: currentTheme.color }, // Màu chữ trong TextField
          }}
          InputLabelProps={{
            style: { color: currentTheme.color }, // Màu chữ nhãn
            shrink: true,
          }}
          sx={{
            mt: 3,
            backgroundColor: currentTheme.backgroundColorLow, // Màu nền của input
            "& .MuiInputLabel-root": { color: currentTheme.color }, // Màu chữ của label
            "& .MuiInputBase-input": { color: currentTheme.color }, // Màu chữ của input
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#3d444d" }, // Màu viền
            },
            "& .MuiInputBase-root": {
              borderRadius: "4px", // Làm tròn góc nếu muốn
            },
          }}
        />
        {/* ----------------Các thông tin khác --------------------------- */}
        <Box display="flex" gap={2} mb={4} mt={4}>
          <TextField
            label="Trạng thái tài khoản"
            variant="outlined"
            value={
              dataUser?.GHI_CHU_KH === "1"
                ? "Đang hoạt động"
                : dataUser?.GHI_CHU_KH === "0"
                ? "Ngưng hoạt động"
                : dataUser?.GHI_CHU_KH === "1.5"
                ? "Bị Hạn chế"
                : "Chưa xác định"
            }
            defaultValue="H***g"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              backgroundColor: "#151b23", // Màu nền của input
              "& .MuiInputLabel-root": { color: "#f0ffff" }, // Màu chữ của label
              "& .MuiInputBase-input": { color: "#f0ffff" }, // Màu chữ của input
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#3d444d" }, // Màu viền
              },
              "& .MuiInputBase-root": {
                borderRadius: "4px", // Làm tròn góc nếu muốn
              },
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "20px", backgroundColor: "#26bbff" }}
          onClick={handleProfileUpdate} // Gọi hàm cập nhật thông tin
        >
          Lưu thay đổi
        </Button>
      </Container>
    </Box>
  );
};

export default UserProfile;
