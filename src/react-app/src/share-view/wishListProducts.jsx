import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Box,
  Button,
  Typography,
  Card,
  Grid,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Skeleton,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
// import FilterShoes from "../admin-view/pages/quanLySanPham/component/FilterShoe";
import { enqueueSnackbar } from "notistack";
import { setTotalCart } from "../redux/authSlice";
const api = process.env.REACT_APP_URL_SERVER;
const WishlistItem = ({
  name,
  price,

  tags,
  inCart,
  image,
  gender,
  category,

  decription,
  dateLiked,
  handleAddToCart,
  isLoading,
  idProduct,
  removeFromFavorites,
}) => {
  return (
    <Card
      sx={{
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        p: 2,
        backgroundColor: "#202024",
        height: "200px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "left",
          width: "80%",
        }}
      >
        <img
          src={`${api}/images/${image}`} // Replace with correct image URL
          alt={`${name} thumbnail`}
          style={{ marginRight: 16, width: "120px", borderRadius: "13px" }}
        />
        <Box>
          <Typography variant="h6" color="white">
            {name}
          </Typography>
          <Typography variant="body2" color="gray">
            {gender} | {category}
          </Typography>{" "}
          <Typography variant="body2" color="gray" sx={{ width: "90%" }}>
            {decription}
          </Typography>
          <Typography variant="body2" color="gray">
            {moment(dateLiked).format("HH:mm:ss - DD/MM/YYYY ")}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography variant="h6" color="white" sx={{ height: "65%" }}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
          }}
        >
          {" "}
          <Button
            variant="text"
            onClick={() => removeFromFavorites(idProduct)}
            sx={{
              color: "#c9d1d9",
              textTransform: "none",
              fontSize: "10px",
              mr: 2,
              "&:hover": {
                color: "#fffff", // Change text color on hover
              },
            }}
          >
            Loại bỏ
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: "14px",
              backgroundColor: inCart ? "#cccccc" : "#26bbff",
              color: inCart ? "#666666" : "#101014",
              fontWeight: "600",
              fontSize: "10px",
              "&:hover": {
                backgroundColor: inCart ? "#b3b3b3" : "#3ccaff",
              },
            }}
            onClick={() => handleAddToCart(idProduct)}
            disabled={inCart || isLoading} // Vô hiệu hóa nút nếu sản phẩm đã trong giỏ hàng hoặc đang xử lý
          >
            {isLoading
              ? "Processing..."
              : inCart
              ? "View In Cart"
              : "Add To Cart"}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

const WishlistFilters = ({
  searchTerm,
  handleSearchChange,
  setFilteredProducts,
  categories,
  setSelectCategories,
  items,
}) => {
  const handleCategoryChange = (event, values) => {
    setSelectCategories(values);

    // Lấy danh sách MATL từ các category được chọn
    const selectedMATL = values.map((category) => String(category.MATL));

    // Nếu chưa chọn cái nào, hiển thị tất cả sản phẩm
    if (selectedMATL.length === 0) {
      setFilteredProducts(items);
      return;
    }

    console.log("items", items);

    // Lọc sản phẩm
    const filtered = items.filter((product) => {
      // Kiểm tra nếu product.MATL là null hoặc không có giá trị
      if (!product.MATL) return false;

      const productMATL = product.MATL.split(",").map((matl) => matl.trim()); // Chuyển MATL của sản phẩm thành mảng

      // Kiểm tra tất cả product.MATL có trong selectedMATL
      return (
        selectedMATL.every((matl) => productMATL.includes(matl)) &&
        productMATL.every((matl) => selectedMATL.includes(matl))
      );
    });

    setFilteredProducts(filtered);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#202024",
          p: 2,
          borderRadius: 2,
          color: "white",
        }}
      >
        {/* Tìm kiếm theo thể loại */}
        <Autocomplete
          multiple
          options={categories} // Danh sách thể loại
          getOptionLabel={(option) => option.TENTL} // Hiển thị tên thể loại
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                key={index}
                label={option.TENTL}
                {...getTagProps({ index })}
                sx={{ backgroundColor: "#3ccaff", color: "#121212" }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tìm kiếm thể loại"
              variant="outlined"
              fullWidth
              sx={{ input: { color: "white" }, label: { color: "gray" } }}
            />
          )}
          onChange={handleCategoryChange}
        />
      </Box>

      {/* Tìm kiếm theo tên sản phẩm */}
      <Box
        sx={{
          backgroundColor: "#202024",
          p: 2,
          borderRadius: 2,
          color: "white",
          mt: 2, // Khoảng cách trên cho trường tìm kiếm sản phẩm
        }}
      >
        <TextField
          label="Tìm kiếm sản phẩm"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange} // Hàm xử lý tìm kiếm theo tên sản phẩm
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />
      </Box>
    </>
  );
};

const WishlistProducts = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectCategories, setSelectCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ----------------------------------------------

  useEffect(() => {
    if (!isAuthenticated || !userInfo) {
      // Redirect to login if the user is not authenticated or if userInfo is missing
      navigate("/login");
      return;
    }

    fetchWishlistItems();
  }, [isAuthenticated, userInfo, navigate]);
  const fetchWishlistItems = async () => {
    try {
      const response = await axios.post(`${api}/api/v1/yeuthich/xem`, {
        MA_KH: userInfo.MA_KH,
      });
      const response_category = await axios.get(
        `${api}/api/v1/admin/theloai/xemtatca`
      );
      if (response_category.data.EC === 1) {
        setCategories(response_category.data.DT);
      }

      setItems(response.data.DT);
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    } finally {
      setLoading(false);
    }
  };

  //filter products
  const [searchTerm, setSearchTerm] = useState("");

  const [filteredProducts, setFilteredProducts] = useState(items);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16; // Số sản phẩm hiển thị mỗi trang

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Nếu không có từ khóa tìm kiếm, khôi phục lại tất cả sản phẩm
    if (term === "") {
      setFilteredProducts(items);
    } else {
      // Lọc sản phẩm theo từ khóa tìm kiếm
      const filtered = items.filter((product) =>
        product.TENSP.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    const applyFilters = () => {
      let updatedProducts = items;

      // Nếu có từ khóa tìm kiếm, lọc lại
      if (searchTerm) {
        updatedProducts = updatedProducts.filter((product) =>
          product.TENSP.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredProducts(updatedProducts);
    };
    applyFilters();
  }, [
    searchTerm, // Thêm searchTerm vào dependency array
    items,
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleAddToCart = async (idProduct) => {
    try {
      setIsLoading(true);
      const updateDate = dayjs().format("YYYY-MM-DD HH:mm:ss"); // Lấy ngày giờ hiện tại và định dạng

      const response = await axios.post(
        `${api}/api/v1/yeuthich/add-cart/delete-wish`,
        {
          userId: userInfo.MA_KH,
          productId: idProduct,
          updateDate,
        }
      );

      console.log("responsive ", response.data);
      if (response.data.EC === 1) {
        // Cập nhật trạng thái giỏ hàng thành công
        fetchWishlistItems();
        enqueueSnackbar(response.data.EM, { variant: "success" });
        dispatch(setTotalCart(response.data.totalQuantity));
      } else {
        enqueueSnackbar(response.data.EM); // Hiển thị lỗi từ API
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      enqueueSnackbar(error.response.data.EM, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const removeFromFavorites = async (idSanPham) => {
    try {
      const response = await axios.post(`${api}/api/v1/yeuthich/xoa`, {
        MASP: idSanPham,
        MA_KH: userInfo.MA_KH,
      });
      console.log("daa", response.data);
      if (response.data.EC === 1) {
        fetchWishlistItems();
        enqueueSnackbar(response.data.EM, { variant: "success" });
      } else {
        fetchWishlistItems();
        enqueueSnackbar(response.data.EM, { variant: "error" });
      }
    } catch (error) {
      console.error("Error removing product from favorites:", error);
      enqueueSnackbar(error.response.data.EM, { variant: "error" });
    }
  };

  const [sortOption, setSortOption] = useState("Newest"); // Trạng thái để lưu lựa chọn sắp xếp
  const [isSortedByDate, setIsSortedByDate] = useState(false); // Trạng thái để kiểm tra có bật "Sort by" không

  // Hàm xử lý sự kiện thay đổi lựa chọn sắp xếp
  const handleSortChange = (event) => {
    const selectedSortOption = event.target.value;
    setSortOption(selectedSortOption);

    // Lọc lại sản phẩm dựa vào lựa chọn
    let sortedProducts = [...items];

    // Sắp xếp theo ngày yêu thích nếu người dùng chọn "Newest"
    if (selectedSortOption === "Newest") {
      sortedProducts.sort(
        (a, b) => new Date(b.NGAY_YEU_THICH) - new Date(a.NGAY_YEU_THICH)
      ); // Sắp xếp theo ngày yêu thích (Mới nhất lên đầu)
    } else if (selectedSortOption === "Oldest") {
      sortedProducts.sort(
        (a, b) => new Date(a.NGAY_YEU_THICH) - new Date(b.NGAY_YEU_THICH)
      ); // Sắp xếp theo ngày yêu thích (Cũ nhất lên đầu)
    } else if (selectedSortOption === "On Sale") {
      sortedProducts = sortedProducts.filter((product) => product.isOnSale); // Lọc các sản phẩm đang giảm giá
    } else if (selectedSortOption === "Popular") {
      sortedProducts.sort((a, b) => b.popularity - a.popularity); // Sắp xếp theo độ phổ biến (có thể thay bằng một thuộc tính khác)
    }

    setFilteredProducts(sortedProducts);
  };

  // Hàm xử lý sự kiện khi bật/tắt chế độ sắp xếp
  const handleSwitchChange = (event) => {
    setIsSortedByDate(event.target.checked);
    // Nếu bật sắp xếp theo ngày, gọi hàm sắp xếp
    if (event.target.checked) {
      setFilteredProducts(
        [...items].sort(
          (a, b) => new Date(b.NGAY_YEU_THICH) - new Date(a.NGAY_YEU_THICH)
        )
      );
    } else {
      setFilteredProducts(items); // Nếu không sắp xếp, hiển thị tất cả sản phẩm
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
  return (
    <Grid
      container
      spacing={2}
      sx={{ p: 4, backgroundColor: "#121212", justifyContent: "center" }}
    >
      <Grid item xs={12}>
        <Typography variant="h4" color="white">
          My Wishlist
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
          <Switch
            defaultChecked={isSortedByDate}
            onChange={handleSwitchChange}
            color="primary"
          />
          <Typography variant="body2" color="white">
            Lọc theo:
          </Typography>
          <FormControl sx={{ ml: 1, minWidth: 120 }}>
            <Select
              sx={{ color: "#c9d1d9" }}
              value={sortOption} // Lưu trữ giá trị hiện tại của lựa chọn sắp xếp
              onChange={handleSortChange} // Hàm xử lý thay đổi lựa chọn
            >
              <MenuItem value="Newest">Mới nhất</MenuItem>
              <MenuItem value="Oldest">Cũ nhất</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ backgroundColor: "#555", mb: 2 }} />
      </Grid>
      <Grid item xs={12} md={8} lg={8}>
        {filteredProducts.map((item, index) => (
          <WishlistItem
            isLoading={isLoading}
            removeFromFavorites={removeFromFavorites}
            setLoading={setLoading}
            handleAddToCart={handleAddToCart}
            key={index}
            idProduct={item.MASP}
            name={item.TENSP}
            price={item.DON_GIA}
            inCart={false} // Assuming the value can be dynamically set
            image={item.ANH_SP}
            gender={item.NHA_SAN_XUAT}
            category={item.TENTL}
            decription={item.GHI_CHU_SP}
            dateLiked={item.NGAY_YEU_THICH}
          />
        ))}
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <WishlistFilters
          //
          items={items}
          setSelectCategories={setSelectCategories}
          selectCategories={selectCategories}
          categories={categories}
          setCategories={setCategories}
          //
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          setFilteredProducts={setFilteredProducts}
          //
        />
      </Grid>
    </Grid>
  );
};

export default WishlistProducts;
