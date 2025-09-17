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

        <Typography color="gray" variant="body2" sx={{ mt: 1 }}>
          Số lượng: {quantity}
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
  const [selectPhuongThucThanhToan, setSelectPhuongThucThanhToan] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([
    // { MA_THANH_TOAN: 1, CACH_THANH_TOAN: "Chuyển khoản Momo" },
    { MA_THANH_TOAN: 2, CACH_THANH_TOAN: "Thanh toán khi nhận hàng COD" },
    { MA_THANH_TOAN: 3, CACH_THANH_TOAN: "Chuyển khoản VNPAY" },
  ]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated || !userInfo) {
      navigate("/login");
      return;
    }
    fetchCartItems();
  }, [isAuthenticated, userInfo, navigate]);

  const fetchCartItems = async () => {
    try {
      if (!isAuthenticated) {
        enqueueSnackbar("Vui lòng đăng nhập để tiếp tục!");
        return;
      }
      const response = await axios.post(`${api}/api/v1/giohang/xem`, {
        ID_USER: userInfo?.ID_USER || userInfo[0].ID_USER,
      });

      const data = response.data;

      if (data.EC === 1) {
        dispatch(setTotalCart(data.DT.cartSummary[0].totalQuantity));
        setTongTienCart(data.DT.cartSummary[0].totalPrice);
        setItems(data.DT.results);
        setSubtotal(data.DT.cartSummary[0].totalPrice);

        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  useEffect(() => {
    fetchCartItems();
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
          MANGUOIDUNG: userInfo.ID_USER,
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
          ID_USER: userInfo.ID_USER,
          ID_PRODUCTDETAILS: id,
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
    try {
      const response = await axios.post(`${api}/api/v1/giohang/xoa`, {
        ID_USER: userInfo?.ID_USER || userInfo[0].ID_USER,
        ID_PRODUCTDETAILS: id,
      });

      if (response.data.EC === 1) {
        fetchCartItems();
      }
    } catch (error) {
      console.error("Error removing product completely:", error);
    }
  };

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
    const orderInfo = `Shop Điện Tử - Mã đơn hàng: ${orderId}`;

    let result = paymentMethods.find(
      (payment) => payment.MA_THANH_TOAN === selectPhuongThucThanhToan
    );

    const requestData = {
      ID_USER: userInfo?.ID_USER || userInfo[0].ID_USER,
      PHONENUMBER: userInfo?.PHONENUMBER || userInfo[0].PHONENUMBER,
      ADDRESS: userInfo?.ADDRESS || userInfo[0].ADDRESS,
      idThanhToan: selectPhuongThucThanhToan,
      PRICE_PRODUCTDETAILS: tongTienCart,
      trangThaiDonHang: "Đang chờ xác nhận",
      ID_ODER: orderInfo,
      items: items,
      EMAIL: userInfo?.EMAIL || userInfo[0].EMAIL,
      CACH_THANH_TOAN: result.CACH_THANH_TOAN
    };

    try {
      if (result.CACH_THANH_TOAN === "Chuyển khoản Momo") {
        try {
          const responsive = await axios.post(
            "http://emailserivce.somee.com/api/Momo/CreatePaymentUrl",
            {
              fullName: userInfo.LASTNAME,
              orderId: orderInfo,
              options: "mutil",
              orderInfo: orderInfo,
              returnUrl: "http://localhost:3000/checkout",
              amount: tongTienCart, // Gửi tổng tiền trong giỏ hàng
            }
          );
          await axios.post(`${api}/don-hang/tao`, requestData);
          const paymentUrl = responsive.data.url;

          window.location.href = paymentUrl;
        } catch (error) {
          console.error("Error during Momo payment creation:", error);
          enqueueSnackbar(error.response.data.EM, { variant: "info" });
        }

      } else if (result.CACH_THANH_TOAN === "Thanh toán khi nhận hàng COD") {
        try {
          const response = await axios.post(`${api}/don-hang/tao`, requestData);
          if (response.data.EC === 1) {
            enqueueSnackbar(response.data.EM, { variant: "success" });
          } else {
            enqueueSnackbar(response.data.EM, { variant: "info" });
          }
        } catch (error) {
          console.error("Error during Thanh toán tại nhà payment:", error);
          enqueueSnackbar(error.response.data.EM, { variant: "info" });
        }

      } else if (result.CACH_THANH_TOAN == "Chuyển khoản VNPAY") {
        try {
          const response = await axios.post(`${api}/don-hang/tao`, requestData);
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

      fetchCartItems();
    } catch (error) {
      console.error("Error during handleSummitThanhToan:", error);
    }
  };

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
            Giỏ hàng của bạn
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: "#555", mb: 2 }} />
      </Grid>
      <Grid item xs={12} sm={12} md={7} lg={7} xl={8}>
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item, index) => (
            <CartItem
              key={index}
              quantity={item.QUANTITY}
              handleRemoveProduct={handleRemoveProduct}
              handleQuantityChange={handleQuantityChange}
              name={item.NAME_PRODUCTDETAILS}
              price={item.PRICE_PRODUCTDETAILS}
              description={item.category_DESCRIPTION}
              category={`Loại máy: ${item.NAME_CATEGORY}`}
              brand={item.brand_NAME}
              quantityInCart={item.QUANTITY}
              image={item.GALLERYPRODUCT_DETAILS}
              userId={userInfo.ID_USER}
              id={item.ID_PRODUCTDETAILS}
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
