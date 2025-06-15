import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Divider,
  TextField,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Make sure to import axios
import { useSelector, useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { setTotalCart } from "../../redux/authSlice";
import { Payments } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid"; // Thêm thư viện UUID nếu bạn muốn tạo mã đơn hàng duy nhất

// import RecommenderProductCarousel from "../../share-view/productCarousel-recommender";
import AddressSelector from "../../user-view/components/addressUser";
import CommentsSection from "../component-view/binhLuan";
import { getThemeConfig } from "../../service/themeService";

const api = process.env.REACT_APP_URL_SERVER;

const SelectGame = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [binhLuan, setBinhLuan] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const [selectPhuongThucThanhToan, setSelectPhuongThucThanhToan] =
    useState("");
  const currentTheme = getThemeConfig(
    localStorage.getItem("THEMES") || userInfo?.THEMES || "dark"
  );

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
    if (!isAuthenticated) {
      setIsSwitchOn(false);
    }
  }, [id, isAuthenticated]);
  const fetchProduct = async (id) => {
    const ID_USER = userInfo ? userInfo.ID_USER : false;
    try {
      // Gọi API lấy thông tin sản phẩm
      const responseProduct = await axios.post(
        `${api}/api/v1/admin/sanpham/xem-id`,
        {
          ID_PRODUCTDETAILS: id,
          ID_USER: ID_USER,
        }
      );

      if (responseProduct.data.EC === 1) {
        setProduct(responseProduct.data.DT[0]);
      } else {
        console.error(
          "Lỗi khi lấy thông tin sản phẩm:",
          responseProduct.data.EM
        );
      }

      // Gọi API lấy danh sách bình luận
      // const responseBinhLuan = await axios.get(`${api}/binh-luan/${id}`);
      // if (responseBinhLuan.data.EC === 1) {
      //   setBinhLuan(responseBinhLuan.data.DT);
      // } else {
      //   console.error("Lỗi khi lấy bình luận:", responseBinhLuan.data.EM);
      // }

      // Gọi API lấy phương thức thanh toán
      // const responsePayment = await axios.get(
      //   `${api}/api/v1/admin/thanhtoan/use`
      // );
      // if (responsePayment.data.EC === 1) {
      //   setPaymentMethods(responsePayment.data.DT);
      // } else {
      //   console.error(
      //     "Lỗi khi lấy phương thức thanh toán:",
      //     responsePayment.data.EM
      //   );
      // }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  // THÊM VÀO GIỎ HÀNG
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Nếu chưa, chuyển hướng đến trang đăng nhập
      navigate("/login"); // Đảm bảo '/login' là đường dẫn đúng tới trang đăng nhập của bạn
      return; // Dừng hàm nếu chưa đăng nhập
    }
    console.log("userInfo", userInfo);
    try {
      const payload = {
        ID_PRODUCTDETAILS: id,
        ID_USER: userInfo.MA_KH,
        NGAY_CAP_NHAT_GIOHANG: new Date().toISOString(),
      };

      const response = await axios.post(`${api}/api/v1/giohang/them`, payload);

      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        dispatch(setTotalCart(response.data.totalQuantity));

        console.log(response.data.EM); // Thêm vào giỏ hàng thành công
      } else {
        console.log("Lỗi:", response.data.EM); // Xử lý lỗi nếu có
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
      enqueueSnackbar(error.response.data.EM, { variant: "error" });
    }
  };
  // Hàm handleAddToWish
  const handleAddToWish = async () => {
    if (!isAuthenticated) {
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      navigate("/login");
      return; // Dừng hàm nếu chưa đăng nhập
    }

    try {
      const payload = {
        ID_PRODUCTDETAILS: id,
        ID_USER: userInfo.ID_USER, // ID người dùng
      };

      const response = await axios.post(`${api}/api/v1/yeuthich/them`, payload);

      if (response.data.EC === 1) {
        enqueueSnackbar(response.data.EM, { variant: "success" });
        console.log(response.data.EM); // Thêm vào yêu thích thành công
      } else {
        console.log("Lỗi:", response.data.EM); // Xử lý lỗi nếu có
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
      enqueueSnackbar(error.response.data.EM, { variant: "error" });
    }
  };

  //THAY ĐỔI ĐỊA CHỈ
  const [isSwitchOn, setIsSwitchOn] = useState(true); // Trạng thái của Switch
  const handleSwitchChange = (event) => {
    setIsSwitchOn(event.target.checked); // Cập nhật trạng thái
  };
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWards, setSelectedWards] = useState(null);
  const [selectStreetName, setSelectStreetName] = useState(null);
  const [soDienThoai, setSoDienThoai] = useState(null);

  const handleSummitThanhToan = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Vui lòng đăng nhập để tiếp tục!");
      return;
    }
    if (selectPhuongThucThanhToan === "") {
      enqueueSnackbar("Vui lòng chọn phương thức thanh toán!!");
      return;
    }

    // Tạo mã đơn hàng duy nhất
    const orderId = uuidv4();
    const orderInfo = `Epick Game - Mã đơn hàng: ${orderId}`;
    const requestData = {
      idNguoiDung: userInfo.MA_KH,
      idThanhToan: selectPhuongThucThanhToan,
      tongTien: product.DON_GIA,
      trangThaiDonHang: "Đang chờ thanh toán",
      ID_ODER: orderInfo,
      items: [product],
      email: userInfo.TEN_DANG_NHAP,
      DIA_CHI_DON_HANG: isSwitchOn
        ? `${userInfo?.DIA_CHI_STREETNAME}, ${userInfo?.DIA_CHI_Wards}, ${userInfo?.DIA_CHI_Districts}, ${userInfo?.DIA_CHI_Provinces}`
        : `${selectStreetName}, ${selectedWards?.name}, ${selectedDistrict?.name}, ${selectedProvince?.name}`,
      SO_DIEN_THOAI_DON_HANG: isSwitchOn
        ? `${userInfo.SDT_KH}`
        : `${soDienThoai}`,
    };

    let result = paymentMethods.find(
      (payment) => payment.MA_THANH_TOAN === selectPhuongThucThanhToan
    );

    try {
      if (result.CACH_THANH_TOAN === "Momo") {
        try {
          const responsive = await axios.post(
            "http://emailserivce.somee.com/api/Momo/CreatePaymentUrl",
            {
              fullName: userInfo.TEN_KHACH_HANG,
              orderId: orderInfo,
              options: "mutil",
              orderInfo: orderInfo,
              returnUrl: "http://localhost:3000/checkout",
              amount: product.DON_GIA, // Gửi tổng tiền trong giỏ hàng
            }
          );
          await axios.post(`${api}/don-hang`, requestData);
          const paymentUrl = responsive.data.url;

          window.location.href = paymentUrl;
        } catch (error) {
          console.error("Error during Momo payment creation:", error);
          enqueueSnackbar(error.response.data.EM, { variant: "info" });
        }
      } else if (result.CACH_THANH_TOAN === "Thanh toán tại nhà") {
        try {
          const response = await axios.post(`${api}/don-hang`, requestData);
          console.log("check ", response.data);
          if (response.data.EC === 1) {
            console.log("check ", response.data);
            enqueueSnackbar(response.data.EM, { variant: "success" });
          } else {
            enqueueSnackbar(response.data.EM, { variant: "info" });
          }
        } catch (error) {
          console.error("Error during Thanh toán tại nhà payment:", error);
          enqueueSnackbar(error.response.data.EM, { variant: "info" });
        }
      } else if (selectPhuongThucThanhToan == 24) {
        try {
          const response = await axios.post(`${api}/don-hang`, requestData);
          if (response.data.EC === 1) {
            const responsive = await axios.post(
              `${api}/thanh-toan-online/create_payment_url`,
              {
                orderId: orderInfo,

                returnUrl: "http://localhost:3000/checkout-vnpay",
                amount: product.DON_GIA,
                bankCode: "NCB",
                orderType: "fashion",
                language: "vi",
              }
            );

            const paymentUrl = responsive.data.url;
            window.location.href = paymentUrl;
          } else {
            enqueueSnackbar(response.data.EM, { variant: "info" });
          }
          if (response.data.EC === 1) {
            console.log("check ", response.data);
            enqueueSnackbar(response.data.EM, { variant: "success" });
          } else {
            enqueueSnackbar(response.data.EM || "Đặt hàng không thành công", {
              variant: "error",
            });
          }
        } catch (error) {
          console.error("Error during order submission:", error);
          enqueueSnackbar(error.response.data.EM, {
            variant: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error during handleSummitThanhToan:", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>; // Add a loading state
  }

  return (
    <Container maxWidth="lg" className="container-select-game">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={10} md={10}>
          <Box sx={{ textAlign: "left", borderRadius: 1 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "600", color: "#fff", mt: 4 }}
            >
              {product.NAME_PRODUCTDETAILS} {/* Product Name */}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <Box
            sx={{
              textAlign: "left",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
            }}
          ></Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={8} lg={8}>
          <Box
            sx={{
              textAlign: "left",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={`${api}/images/${product.GALLERYPRODUCT_DETAILS}`}
              alt={product.NAME_PRODUCTDETAILS}
              style={{ maxWidth: "70%", height: "auto", borderRadius: "13px" }}
            />
          </Box>{" "}
          <Box
            sx={{
              textAlign: "left",
              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mt: 2,
            }}
          >
            {/* <Box
              sx={{
                textAlign: "left",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography sx={{ color: currentTheme.color, mr: 1 }}>
                Thể loại:
              </Typography>
              {product.categories.map((category, index) => (
                <Typography
                  key={index}
                  sx={{
                    color: currentTheme.color,
                    display: "inline",
                    mr: index < product.categories.length - 1 ? 1 : 0, // Thêm khoảng cách trừ mục cuối
                  }}
                >
                  {category.NAME_CATEGORY}
                  {index < product.categories.length - 1 && ","}{" "}
                </Typography>
              ))}
            </Box>{" "} */}
            <Box
              sx={{
                borderRadius: 1,
                display: "flex",

                mt: 2,
              }}
            >
              {/* <Typography
                sx={{
                  color: currentTheme.color,
                  display: "inline",
                }}
              >
                {product.ISDELETE}
              </Typography> */}
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "#ec8070",
              textAlign: "left",
              borderRadius: 1,
              marginLeft: "-16px",
              display: "flex",
              mt: 2,
            }}
          >

            {/* ----------------------BÌNH LUẬN GAME----------------------------------- */}
            <CommentsSection reviews={binhLuan} />
          </Box>{" "}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <Box
            sx={{
              textAlign: "left",
              borderRadius: 1,
              backgroundColor: currentTheme.backgroundColorLow,
              color: currentTheme.color,
              padding: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              position: "sticky",
              top: 20,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {product.NAME_PRODUCTDETAILS}
            </Typography>
            <Box>
              <Typography sx={{ color: currentTheme.color }} variant="body2">
                Nhà sản xuất: {product.NAME || "N/A"}
              </Typography>
            </Box>
            <Typography sx={{ color: currentTheme.color }} variant="h6">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.PRICE_PRODUCTDETAILS)}
            </Typography>
            {/* Price */}
            <Button
              variant="contained"
              onClick={handleSummitThanhToan}
              disabled={product.DaMua === "Chưa Mua" ? false : true}
              sx={{
                borderRadius: "14px",
                paddingTop: "13px",
                paddingBottom: "13px",
                backgroundColor: "#26bbff",

                color: "#101014",
                fontWeight: "600",
                fontSize: "12px",
                "&:hover": {
                  backgroundColor: "#3ccaff",
                },
              }}
              fullWidth
            >
              Mua ngay
            </Button>{" "}
            <Button
              disabled={product.DaMua === "Chưa Mua" ? false : true}
              onClick={() => handleAddToWish()}
              sx={{
                borderRadius: "14px",
                paddingTop: "13px",
                paddingBottom: "13px",
                backgroundColor: "#343437",
                color: "#fff",
                fontWeight: "600",
                fontSize: "12px",
                "&:hover": {
                  backgroundColor: "#4b4b4e",
                },
              }}
              fullWidth
            >
              Add To Wish
            </Button>
            <Button
              disabled={product.DaMua === "Chưa Mua" ? false : true}
              onClick={() => handleAddToCart()}
              sx={{
                borderRadius: "14px",
                paddingTop: "13px",
                paddingBottom: "13px",
                backgroundColor: "#343437",
                color: "#fff",
                fontWeight: "600",
                fontSize: "12px",
                "&:hover": {
                  backgroundColor: "#4b4b4e",
                },
              }}
              fullWidth
            >
              Add To Cart
            </Button>
            <FormControl sx={{ mb: 2, mt: 2 }}>
              <InputLabel
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: currentTheme.color,
                  fontWeight: "500",
                }}
              >
                <Payments sx={{ mr: 1 }} />
                Phương thức thanh toán
              </InputLabel>
              <Select
                value={selectPhuongThucThanhToan}
                label="Icon Phương thức thanh toán"
                onChange={(e) => setSelectPhuongThucThanhToan(e.target.value)}
                sx={{
                  backgroundColor: currentTheme.backgroundColorLow,
                  color: currentTheme.color,
                }}
              >
                {" "}
                <MenuItem value="">Xem tất cả</MenuItem>
                {paymentMethods.map((item) => (
                  <MenuItem key={item.MA_THANH_TOAN} value={item.MA_THANH_TOAN}>
                    {item.CACH_THANH_TOAN}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>{" "}
            {isSwitchOn ? (
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Switch
                  checked={isSwitchOn} // Liên kết trạng thái với Switch
                  onChange={handleSwitchChange}
                  color="primary"
                />
                {userInfo && (
                  <>
                    <Typography
                      variant="body2"
                      color="white"
                      sx={{ fontSize: "11px", color: currentTheme.color }}
                    >
                      {`Địa chỉ: ${userInfo.DIA_CHI_STREETNAME}, ${userInfo?.DIA_CHI_Wards}, 
              ${userInfo?.DIA_CHI_Districts}, ${userInfo?.DIA_CHI_Provinces}`}
                    </Typography>
                  </>
                )}
              </Box>
            ) : (
              <>
                <Switch
                  checked={isSwitchOn} // Liên kết trạng thái với Switch
                  onChange={handleSwitchChange}
                  color="primary"
                />{" "}
                <Typography
                  variant="body2"
                  color="white"
                  sx={{ fontSize: "11px", color: currentTheme.color }}
                >
                  {`Địa chỉ: ${selectStreetName || " "} ${selectedWards || ""} 
        ${selectedDistrict || ""} ${selectedProvince || ""}`}
                </Typography>
                <AddressSelector
                  selectedProvince={selectedProvince}
                  selectedDistrict={selectedDistrict}
                  selectedWards={selectedWards}
                  //
                  setSelectedProvince={setSelectedProvince}
                  setSelectedDistrict={setSelectedDistrict}
                  setSelectedWards={setSelectedWards}
                  backgroundColor={"#343437"}
                  color={"#fff"}
                />{" "}
                <TextField
                  label="Tên đường"
                  variant="outlined"
                  value={selectStreetName} // Đảm bảo giá trị mặc định là chuỗi rỗng nếu không có dataUser hoặc EMAIL
                  fullWidth
                  InputProps={{
                    style: { color: currentTheme.color }, // Màu chữ trong TextField
                  }}
                  onChange={(e) => setSelectStreetName(e.target.value)}
                  InputLabelProps={{
                    style: { color: currentTheme.color }, // Màu chữ nhãn
                  }}
                  sx={{
                    backgroundColor: currentTheme.backgroundColorLow, // Màu nền của input
                    "& .MuiInputLabel-root": { color: currentTheme.color }, // Màu chữ của label
                    "& .MuiInputBase-input": { color: currentTheme.color }, // Màu chữ của input
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#00000" }, // Màu viền
                    },
                    "& .MuiInputBase-root": {
                      borderRadius: "4px", // Làm tròn góc nếu muốn
                    },
                  }}
                />{" "}
                <TextField
                  label="Số điện thoại"
                  variant="outlined"
                  type="number"
                  value={soDienThoai} // Đảm bảo giá trị mặc định là chuỗi rỗng nếu không có dataUser hoặc EMAIL
                  fullWidth
                  InputProps={{
                    style: { color: currentTheme.color }, // Màu chữ trong TextField
                  }}
                  onChange={(e) => setSoDienThoai(e.target.value)}
                  InputLabelProps={{
                    style: { color: currentTheme.color }, // Màu chữ nhãn
                  }}
                  sx={{
                    backgroundColor: currentTheme.backgroundColorLow, // Màu nền của input
                    "& .MuiInputLabel-root": { color: currentTheme.color }, // Màu chữ của label
                    "& .MuiInputBase-input": { color: currentTheme.color }, // Màu chữ của input
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#00000" }, // Màu viền
                    },
                    "& .MuiInputBase-root": {
                      borderRadius: "4px", // Làm tròn góc nếu muốn
                    },
                  }}
                />
              </>
            )}
            <Divider sx={{ backgroundColor: "#555", mb: 2 }} />
            {/* <Box>
              <Typography
                variant="body2"
                sx={{
                  color: currentTheme.color,
                  borderBottom: "1px solid rgba(204, 204, 204, 0.5)",
                  paddingTop: 3,
                  paddingBottom: 1,
                }}
              >
                Màu sắc: {product.TEN_MAU_SAC}
              </Typography>
            </Box> */}
          </Box>
        </Grid>
      </Grid>
      {/* {id && <RecommenderProductCarousel ID_SAN_PHAM={id} />} */}
    </Container>
  );
};

export default SelectGame;
