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
          ID_USER: userInfo.ID_USER,
        }
      );

      if (response.data.EC === 1) {
        console.log("Thông tin: ", response.data.DT[0])
        // {
        //     "ID_USER": 4,
        //     "ID_ROLE": 1,
        //     "EMAIL": "baoquoczero@gmail.com",
        //     "FIRSTNAME": "Nguyễn",
        //     "LASTNAME": "Bảo",
        //     "PHONENUMBER": "0372701722",
        //     "CODEADDRESS": "0",
        //     "ADDRESS": "W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam",
        //     "PASSWORD": "$2b$10$1m7ccgXwL7c5c7Cp8Cf8Hu/fPotcQ.H.qdaXZnDs8FWGfmW9wVBEO",
        //     "CREATEAT": null,
        //     "UPDATEAT": null,
        //     "ISDELETE": 0
        // }
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
      enqueueSnackbar(error.response.data.EM);
    }
  };

  // Hàm callback để cập nhật avatar mới từ AvatarChanger
  const handleAvatarChange = (newAvatar) => {
    setCurrentAvatar(URL.createObjectURL(newAvatar));
  };

  const handleProfileUpdate = async () => {

    // Kiểm tra định dạng số điện thoại (đảm bảo là một chuỗi số hợp lệ)
    const phoneRegex = /^[0-9]{10}$/; // Số điện thoại phải có từ 10 đến 11 chữ số
    if (!phoneRegex.test(dataUser.PHONENUMBER)) {
      enqueueSnackbar("Số điện thoại không hợp lệ", { variant: "error" });
      return; // Ngừng thực hiện tiếp
    }
    console.log("dataUser: ", dataUser)
    // const updatedData = {
    //   TEN_KHACH_HANG: dataUser.TEN_KHACH_HANG,
    //   SDT_KH: dataUser.SDT_KH,
    //   NGAY_SINH: selectedDate,
    //   DIA_CHI_Provinces: selectedProvince.full_name,
    //   DIA_CHI_Districts: selectedDistrict.full_name,
    //   DIA_CHI_Wards: selectedWards.full_name,
    //   DIA_CHI_STREETNAME: selectStreetName,
    //   MA_KH: userInfo.MA_KH,
    // };

    try {
      const response = await axios.post(
        `${api}/api/v1/KhachHang/sua/thongtin`,
        dataUser
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
        {/* <AvatarChanger
          userId={userInfo?.MA_KH}
          currentAvatar={`${api}/images/${currentAvatar}`}
          onAvatarChange={handleAvatarChange}
        /> */}

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
            value={dataUser?.EMAIL || ""}
            InputLabelProps={{
              sx: {
                color: "#fff",
                "&.Mui-disabled": {
                  color: "#fff",
                  opacity: 0.8, // label mờ nhẹ khi disabled
                },
              },
            }}
            sx={{
              backgroundColor: "#1e242c", // nền tối hơn ô bình thường
              "& .MuiInputBase-input": {
                color: "#f0ffff",
                "&.Mui-disabled": {
                  color: "#f0ffff",
                  WebkitTextFillColor: "#f0ffff",
                  cursor: "not-allowed", // chuột bị cấm khi hover
                },
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#3d444d" },
                "&.Mui-disabled fieldset": {
                  borderColor: "#3d444d",
                },
              },
              "& .MuiInputBase-root": {
                borderRadius: "4px",
                "&.Mui-disabled": {
                  opacity: 0.85, // làm ô mờ nhẹ
                },
              },
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
            label="Họ"
            variant="outlined"
            fullWidth
            value={dataUser?.FIRSTNAME || ""}
            onChange={(e) =>
              setDataUser({ ...dataUser, FIRSTNAME: e.target.value })
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
            }}
          />

          <TextField
            label="Tên"
            variant="outlined"
            fullWidth
            value={dataUser?.LASTNAME || ""}
            onChange={(e) =>
              setDataUser({ ...dataUser, LASTNAME: e.target.value })
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
            value={dataUser?.PHONENUMBER || ""}
            onChange={(e) =>
              setDataUser({ ...dataUser, PHONENUMBER: e.target.value })
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
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <TextField
            label="Địa chỉ"
            variant="outlined"
            value={dataUser?.ADDRESS || ""}
            onChange={(e) =>
              setDataUser({ ...dataUser, ADDRESS: e.target.value })
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
        </Box>
        {/* ----------------Các thông tin khác --------------------------- */}
        <TextField
          label="Trạng thái tài khoản"
          variant="outlined"
          disabled
          value={
            dataUser?.ISDELETE === 0
              ? "Đang hoạt động"
              : dataUser?.ISDELETE === 1
                ? "Ngưng hoạt động"
                : dataUser?.ISDELETE === 2
                  ? "Bị Hạn chế"
                  : "Chưa xác định"
          }
          fullWidth
          InputLabelProps={{
            sx: {
              color: "#fff",
              "&.Mui-disabled": {
                color: "#fff",
                opacity: 0.8, // làm label nhạt hơn chút
              },
            },
          }}
          sx={{
            backgroundColor: "#1e242c", // nền khác biệt hơn ô nhập
            "& .MuiInputBase-input": {
              color: "#f0ffff",
              "&.Mui-disabled": {
                color: "#f0ffff",
                WebkitTextFillColor: "#f0ffff",
                cursor: "not-allowed", // icon chuột khi hover
              },
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#3d444d" },
              "&.Mui-disabled fieldset": {
                borderColor: "#3d444d",
              },
            },
            "& .MuiInputBase-root": {
              borderRadius: "4px",
              "&.Mui-disabled": {
                opacity: 0.85, // làm ô mờ nhẹ
              },
            },
          }}
        />

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