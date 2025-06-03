import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  Card,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Switch,
  IconButton,
  InputLabel,
  Skeleton,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid"; // Thêm thư viện UUID nếu bạn muốn tạo mã đơn hàng duy nhất

import { Payments } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Add, Remove } from "@mui/icons-material";
import axios from "axios";
import { setItemCart, setTotalCart, setIdOder } from "../redux/authSlice";
import { enqueueSnackbar } from "notistack";
const api = process.env.REACT_APP_URL_SERVER;
const CartItem = ({
  id, // Assuming each item has a unique id
  name,
  price,
  description,
  gender,
  category,
  material,
  brand,
  quantityInCart,
  image,

  userId,
  fetchCartItems,
  handleQuantityChange,
  color,
  phongCach,
  mucDich,
  kichCo,
  quantity,
  handleRemoveProduct,
}) => {
  return (
    <Card
      sx={{
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        p: 2,
        backgroundColor: "#202024",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "left" }}>
        <img
          src={`${api}/images/${image}`}
          alt={`${name} thumbnail`}
          style={{ marginRight: 16, width: "80px", borderRadius: "13px" }}
        />
        <Box>
          <Typography variant="h6" color="white">
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="gray"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              width: "90%",
              overflow: "hidden",
              WebkitLineClamp: 2, // Hiển thị tối đa 2 dòng
            }}
          >
            {description}
          </Typography>

          <Typography variant="body2" color="gray">
            {category}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography color="white">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </Typography>

        <Button
          sx={{ mt: 2 }}
          variant="text"
          color="error"
          onClick={() => handleRemoveProduct(id)}
        >
          Loại bỏ
        </Button>
      </Box>
    </Card>
  );
};

const CartSummary = ({
  subtotal,
  tongTienCart,
  paymentMethods,
  selectPhuongThucThanhToan,
  setSelectPhuongThucThanhToan,
  handleSummitThanhToan,
}) => (
  <Box sx={{ backgroundColor: "#202024", p: 2, borderRadius: 2 }}>
    <Typography variant="h6" color="white">
      Giỏ hàng
    </Typography>
    <Divider sx={{ my: 1, backgroundColor: "#555" }} />
    <Typography color="white">
      {tongTienCart ? (
        <>
          {" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(tongTienCart)}
        </>
      ) : (
        <>0đ</>
      )}
    </Typography>
    <Typography color="white">Các hình thức thanh toán</Typography>{" "}
    {/* Trạng thái */}
    <FormControl sx={{ mb: 2, minWidth: 300, mt: 2 }}>
      <InputLabel
        sx={{ display: "flex", alignItems: "center", color: "#c9d1d9" }}
      >
        <Payments sx={{ mr: 1 }} />
        Phương thức thanh toán
      </InputLabel>
      <Select
        value={selectPhuongThucThanhToan}
        label="Icon Phương thức thanh toán"
        onChange={(e) => setSelectPhuongThucThanhToan(e.target.value)}
        sx={{ color: "#c9d1d9" }}
      >
        {" "}
        <MenuItem value="">Xem tất cả</MenuItem>
        {paymentMethods.map((item) => (
          <MenuItem key={item.ID_THANH_TOAN} value={item.MA_THANH_TOAN}>
            {item.CACH_THANH_TOAN}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <Divider sx={{ my: 1, backgroundColor: "#555" }} />
    <Button
      variant="contained"
      onClick={() => handleSummitThanhToan()}
      sx={{
        borderRadius: "14px",
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
      Thanh toán
    </Button>
  </Box>
);

const Cart = () => {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const { isAuthenticated, userInfo, itemCart, totalCart } = useSelector(
    (state) => state.auth
  );
  const [tongTienCart, setTongTienCart] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectPhuongThucThanhToan, setSelectPhuongThucThanhToan] =
    useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated || !userInfo) {
      // Redirect to login if user is not authenticated or userInfo is missing
      navigate("/login");
      return;
    }

    fetchCartItems();
  }, [isAuthenticated, userInfo, navigate]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.post(`${api}/api/v1/giohang/xem`, {
        MA_KH: userInfo.MA_KH,
      });

      const data = response.data;

      if (data.EC === 1) {
        dispatch(setTotalCart(data.DT.results_dem.tong_so_luong));
        setTongTienCart(data.DT.results_dem.tong_tien);
        setItems(data.DT.results);
        setSubtotal(data.DT.results_dem.tong_tien);

        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const [paymentMethods, setPaymentMethods] = useState([]);
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`${api}/api/v1/admin/thanhtoan/use`);
      if (response.data.EC === 1) {
        setPaymentMethods(response.data.DT);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const handleQuantityChange = async (newQuantity, id, title) => {
    try {
      if (newQuantity < 1) return; // Prevents quantity from going below 1

      if (title === "Add") {
        // Tăng số lượng
        const response = await axios.post(`${api}/api/v1/giohang/them`, {
          MANGUOIDUNG: userInfo.MA_KH,
          MASP: id,
          NGAY_CAP_NHAT_GIOHANG: new Date().toISOString(),
        });

        if (response.data.EC === 1) {
          fetchCartItems();

          // onQuantityChange(id, newQuantity);
        } else {
          console.error("Error adding quantity:", response.data.EM);
        }
      } else if (title === "Delete") {
        // Giảm số lượng
        const response = await axios.delete(`${api}/api/v1/giohang/xoa`, {
          userId: userInfo.MA_KH,
          productId: id,
        });

        if (response.data.EC === 1) {
          fetchCartItems();

          // onQuantityChange(id, newQuantity);
        } else {
          console.error("Error removing quantity:", response.data.EM);
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveProduct = async (id) => {
    console.log("handleRemoveProduct", id);
    try {
      const response = await axios.post(`${api}/api/v1/giohang/xoa`, {
        MA_KH: userInfo.MA_KH,
        MASP: id,
      });

      if (response.data.EC === 1) {
        fetchCartItems();
      }
    } catch (error) {
      console.error("Error removing product completely:", error);
    }
  };

  const handleSummitThanhToan = async () => {
    if (selectPhuongThucThanhToan === "") {
      enqueueSnackbar("Vui lòng chọn phương thức thanh toán!!");
      return;
    }

    // Lưu giỏ hàng vào Redux
    dispatch(setItemCart(items));

    // Tạo mã đơn hàng duy nhất
    const orderId = uuidv4();
    const orderInfo = `Epic Game - Mã đơn hàng: ${orderId}`;
    const requestData = {
      idNguoiDung: userInfo.MA_KH,
      idThanhToan: selectPhuongThucThanhToan,
      tongTien: tongTienCart,
      trangThaiDonHang: "Đang chờ thanh toán",
      ID_ODER: orderInfo,
      items: items,
      email: userInfo.TEN_DANG_NHAP,
      DIA_CHI_DON_HANG: `${userInfo.DIA_CHI_STREETNAME}, ${userInfo.DIA_CHI_Wards}, ${userInfo.DIA_CHI_Districts}, ${userInfo.DIA_CHI_Provinces}`,
      SO_DIEN_THOAI_DON_HANG: userInfo.SDT_KH,
    };

    let result = paymentMethods.find(
      (payment) => payment.MA_THANH_TOAN === selectPhuongThucThanhToan
    );

    if (result.CACH_THANH_TOAN === "Momo") {
      try {
        dispatch(setIdOder(orderId));
        const response = await axios.post(`${api}/don-hang`, requestData);
        const responsive = await axios.post(
          "http://emailserivce.somee.com/api/Momo/CreatePaymentUrl",
          {
            fullName: userInfo.TEN_KHACH_HANG,
            orderId: orderInfo,
            options: "mutil",
            orderInfo: orderInfo,
            returnUrl: "http://localhost:3000/checkout",
            amount: tongTienCart, // Gửi tổng tiền trong giỏ hàng
          }
        );

        const paymentUrl = responsive.data.url;

        if (response.data.EC === 1) {
          window.location.href = paymentUrl;
        }
      } catch (error) {
        console.error("Error during payment creation:", error);
        enqueueSnackbar(
          "Đã xảy ra lỗi khi tạo URL thanh toán. Vui lòng thử lại!",
          { variant: "error" }
        );
      }
    } else if (result.CACH_THANH_TOAN === "Thanh toán tại nhà") {
      try {
        const response = await axios.post(`${api}/don-hang`, requestData);
        console.log("check ", response.data);
        if (response.data.EC === 1) {
          console.log("check ", response.data);
          fetchCartItems();
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
    } else if (selectPhuongThucThanhToan == 24) {
      try {
        const response = await axios.post(`${api}/don-hang`, requestData);
        if (response.data.EC === 1) {
          const responsive = await axios.post(
            `${api}/thanh-toan-online/create_payment_url`,
            {
              orderId: orderInfo,

              returnUrl: "http://localhost:3000/checkout-vnpay",
              amount: tongTienCart,
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
  };

  // if (loading) {
  //   return (
  //     <div>
  //       <Skeleton variant="rectangular" width="100%" height={100} />
  //       <Skeleton variant="text" />
  //       <Skeleton variant="text" />
  //     </div>
  //   );
  // }
  console.log("items", items);
  return (
    <Grid
      container
      spacing={2}
      sx={{
        p: 4,
        backgroundColor: "#121212",
        justifyContent: "center",
      }}
    >
      {" "}
      <Grid item xs={12}>
        <Box sx={{ textAlign: "left", paddingLeft: 2 }}>
          {" "}
          <Typography variant="h4" color="white">
            My Cart
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
          <Switch defaultChecked color="primary" />
          <Typography variant="body2" color="white">
            Sort by:{" "}
          </Typography>
          <FormControl sx={{ ml: 1, minWidth: 120 }}>
            <Select sx={{ color: "#c9d1d9" }} defaultValue="Newest">
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="On Sale">On Sale</MenuItem>
              <MenuItem value="Popular">Popular</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ backgroundColor: "#555", mb: 2 }} />
      </Grid>
      <Grid item xs={12} sm={12} md={7} lg={7} xl={8}>
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item, index) => (
            <CartItem
              key={index}
              quantity={item.so_luong_san_pham}
              handleRemoveProduct={handleRemoveProduct}
              handleQuantityChange={handleQuantityChange}
              name={item.TENSP}
              price={item.DON_GIA}
              description={item.GHI_CHU_SP}
              gender={item.TEN_GIOI_TINH}
              category={item.TENTL}
              brand={item.TEN_THUONG_HIEU}
              quantityInCart={item.so_luong_san_pham}
              image={item.ANH_SP}
              userId={userInfo.ID_NGUOI_DUNG}
              id={item.MASP}
              fetchCartItems={fetchCartItems}
            />
          ))
        ) : (
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            Không có sản phẩm trong giỏ hàng.
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={3.5} xl={4}>
        <CartSummary
          handleSummitThanhToan={handleSummitThanhToan}
          subtotal={subtotal}
          tongTienCart={tongTienCart}
          paymentMethods={paymentMethods}
          //
          selectPhuongThucThanhToan={selectPhuongThucThanhToan}
          setSelectPhuongThucThanhToan={setSelectPhuongThucThanhToan}
        />
      </Grid>
    </Grid>
  );
};

export default Cart;
