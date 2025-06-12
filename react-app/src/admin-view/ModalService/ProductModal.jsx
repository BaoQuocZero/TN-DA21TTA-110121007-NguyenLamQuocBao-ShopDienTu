import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Modal,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
const api = process.env.REACT_APP_URL_SERVER;
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "90vh",         // Giới hạn chiều cao tối đa
  overflowY: "auto",         // Cho phép cuộn dọc nếu vượt quá
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,           // (tuỳ chọn) thêm bo góc
};


const ProductModal = ({ product, fetchProducts, onDelete, open, onClose }) => {
  const [form, setForm] = useState({
    NAME_PRODUCTDETAILS: "",
    PRICE_PRODUCTDETAILS: "",
    NHA_SAN_XUAT: "", //NAME
    GALLERYPRODUCT_DETAILS: null,
    ISDELETE: "",
    selectedCategories: [], // Thêm trạng thái cho các thể loại đã chọn
  });
  const [categories, setCategories] = useState([]);
  console.log("products", product);
  console.log("form", form);
  console.log("category", categories);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      // Tách các MATL từ MATL_ARRAY
      const matlArray = product.MATL_ARRAY
        ? product.MATL_ARRAY.split(",").map((matl) => parseInt(matl, 10))
        : [];

      // Lấy các thể loại khớp từ danh sách categories
      const matchedCategories = categories.filter((category) =>
        matlArray.includes(category.MATL)
      );

      // Cập nhật form
      setForm({
        ...product,
        NAME_CATEGORY: product.NAME_CATEGORY ? product.NAME_CATEGORY.split(",") : [],
        selectedCategories: matchedCategories.map((category) => category.MATL), // Chỉ lấy MATL
      });
    } else {
      setForm({
        NAME_PRODUCTDETAILS: "",
        PRICE_PRODUCTDETAILS: "",
        NHA_SAN_XUAT: "", //NAME
        GALLERYPRODUCT_DETAILS: null,
        ISDELETE: "",
        selectedCategories: [],
      });
    }
  }, [product, categories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/api/v1/admin/theloai/xemtatca`);
      setCategories(response.data.DT);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "GALLERYPRODUCT_DETAILS") {
      setForm((prev) => ({ ...prev, GALLERYPRODUCT_DETAILS: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (event) => {
    const selectedId = parseInt(event.target.value);
    setForm((prevForm) => ({
      ...prevForm,
      selectedCategories: event.target.checked
        ? [...prevForm.selectedCategories, selectedId]
        : prevForm.selectedCategories.filter((id) => id !== selectedId),
    }));
  };
  const handleSubmit = async () => {
    if (!form.GALLERYPRODUCT_DETAILS) {
      alert("Vui lòng chọn một hình ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("TENSP", form.NAME_PRODUCTDETAILS);
    formData.append("DON_GIA", form.PRICE_PRODUCTDETAILS);
    formData.append("NHA_SAN_XUAT", form.NHA_SAN_XUAT);
    formData.append("TRANG_THAI_SAN_PHAM", form.ISDELETE);
    formData.append(
      "selectedCategories",
      JSON.stringify(form.selectedCategories)
    );

    // Nếu có ảnh, bạn cần thêm ảnh vào formData
    if (form.GALLERYPRODUCT_DETAILS) {
      formData.append("GALLERYPRODUCT_DETAILS", form.GALLERYPRODUCT_DETAILS);
    }

    try {
      const url = product
        ? `${api}/api/v1/admin/sanpham/sua/${product.ID_PRODUCTDETAILS}`
        : `${api}/api/v1/admin/sanpham/tao`; // Sử dụng POST cho thêm sản phẩm mới

      const method = product ? "put" : "post"; // Sử dụng PUT cho cập nhật và POST cho thêm mới

      const response = await axios[method](url, formData);

      if (response.data.EC === 1) {
        fetchProducts();
        onClose();
      } else {
        alert(response.data.EM);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Lỗi khi cập nhật sản phẩm");
    }
  };
  console.log("product", product);
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="h2">
          {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Tên sản phẩm"
          name="NAME_PRODUCTDETAILS"
          value={form.NAME_PRODUCTDETAILS}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Đơn giá"
          name="PRICE_PRODUCTDETAILS"
          type="number"
          value={form.PRICE_PRODUCTDETAILS}
          onChange={handleChange}
          required
          inputProps={{ min: "0" }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Nhà sản xuất"
          name="NHA_SAN_XUAT"
          value={form.NHA_SAN_XUAT}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="GALLERYPRODUCT_DETAILS"
          accept="image/*"
          onChange={handleChange}
          style={{ marginTop: "16px", marginBottom: "16px" }}
          required
        />
        <Select
          margin="dense"
          label="Trạng Thái"
          fullWidth
          name="ISDELETE"
          variant="outlined"
          value={form.ISDELETE}
          onChange={handleChange}
        >
          <MenuItem value="1">Đang kinh doanh</MenuItem>
          <MenuItem value="0">Ngưng kinh doanh</MenuItem>
        </Select>

        <FormControl fullWidth margin="normal">
          <Autocomplete
            multiple
            options={categories} // Danh sách các thể loại
            getOptionLabel={(option) => option.TENTL} // Hiển thị tên thể loại
            value={
              categories.filter((category) =>
                form.selectedCategories.includes(category.ID_CATEGORY)
              ) // Tìm các thể loại khớp với selectedCategories
            }
            onChange={(event, newValue) =>
              setForm((prevForm) => ({
                ...prevForm,
                selectedCategories: newValue.map((item) => item.ID_CATEGORY), // Cập nhật selectedCategories
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn thể loại"
                placeholder="Thêm thể loại"
              />
            )}
          />
        </FormControl>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <button
            className="btn btn-primary admin-btn"
            onClick={() => handleSubmit()}
          >
            {product ? "Cập nhật" : "Tạo mới"}
          </button>
          {product && (
            <button
              className="btn btn-danger admin-btn"
              onClick={() => onDelete(product)}
              style={{ marginLeft: "10px" }}
            >
              Xóa
            </button>
          )}
          <button
            className="btn btn-danger admin-btn"
            onClick={onClose}
            style={{ marginLeft: "10px" }}
          >
            Huỷ
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductModal;
