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
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ProductModal = ({ product, fetchProducts, onDelete, open, onClose }) => {
  const [form, setForm] = useState({
    TENSP: "",
    DON_GIA: "",
    NHA_SAN_XUAT: "",
    ANH_SP: null,
    GHI_CHU_SP: "",
    TRANG_THAI_SAN_PHAM: "",
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
        TENTL: product.TENTL ? product.TENTL.split(",") : [],
        selectedCategories: matchedCategories.map((category) => category.MATL), // Chỉ lấy MATL
      });
    } else {
      setForm({
        TENSP: "",
        DON_GIA: "",
        NHA_SAN_XUAT: "",
        ANH_SP: null,
        GHI_CHU_SP: "",
        TRANG_THAI_SAN_PHAM: "",
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
  console.log("form", form);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "ANH_SP") {
      setForm((prev) => ({ ...prev, ANH_SP: files[0] }));
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
    if (!form.ANH_SP) {
      alert("Vui lòng chọn một hình ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("TENSP", form.TENSP);
    formData.append("DON_GIA", form.DON_GIA);
    formData.append("NHA_SAN_XUAT", form.NHA_SAN_XUAT);
    formData.append("GHI_CHU_SP", form.GHI_CHU_SP);
    formData.append("TRANG_THAI_SAN_PHAM", form.TRANG_THAI_SAN_PHAM);
    formData.append(
      "selectedCategories",
      JSON.stringify(form.selectedCategories)
    );

    // Nếu có ảnh, bạn cần thêm ảnh vào formData
    if (form.ANH_SP) {
      formData.append("ANH_SP", form.ANH_SP);
    }

    try {
      const url = product
        ? `${api}/api/v1/admin/sanpham/sua/${product.MASP}`
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
          name="TENSP"
          value={form.TENSP}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Đơn giá"
          name="DON_GIA"
          type="number"
          value={form.DON_GIA}
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
          name="ANH_SP"
          accept="image/*"
          onChange={handleChange}
          style={{ marginTop: "16px", marginBottom: "16px" }}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Ghi chú"
          name="GHI_CHU_SP"
          value={form.GHI_CHU_SP}
          onChange={handleChange}
          multiline
          rows={4}
        />
        <Select
          margin="dense"
          label="Trạng Thái"
          fullWidth
          name="TRANG_THAI_SAN_PHAM"
          variant="outlined"
          value={form.TRANG_THAI_SAN_PHAM}
          onChange={handleChange}
        >
          <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
          <MenuItem value="Ngưng hoạt động">Ngưng hoạt động</MenuItem>
        </Select>

        <FormControl fullWidth margin="normal">
          <Autocomplete
            multiple
            options={categories} // Danh sách các thể loại
            getOptionLabel={(option) => option.TENTL} // Hiển thị tên thể loại
            value={
              categories.filter((category) =>
                form.selectedCategories.includes(category.MATL)
              ) // Tìm các thể loại khớp với selectedCategories
            }
            onChange={(event, newValue) =>
              setForm((prevForm) => ({
                ...prevForm,
                selectedCategories: newValue.map((item) => item.MATL), // Cập nhật selectedCategories
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
