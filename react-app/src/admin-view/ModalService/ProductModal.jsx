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
  Grid,
} from "@mui/material";
import axios from "axios";
const api = process.env.REACT_APP_URL_SERVER;
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxHeight: "90vh",         // Giới hạn chiều cao tối đa
  overflowY: "auto",         // Cho phép cuộn dọc nếu vượt quá
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,           // (tuỳ chọn) thêm bo góc
};


const ProductModal = ({ product, fetchProducts, onDelete, open, onClose }) => {
  const [form, setForm] = useState({
    selectedCategories: [],
    selectedPromotion: [],
    selectedBrand: [],

    UNIT: 0,
    METATITLE: "",
    SHORTDESCRIPTION: "",
    DESCRIPTION: "",
    METADESCRIPTION: "",

    NAME_PRODUCTDETAILS: "",
    PRICE_PRODUCTDETAILS: 0,
    AMOUNT_AVAILABLE: 0,
    SPECIFICATION: "",
    Import_Price: 0,

    GALLERYPRODUCT_DETAILS: null,
    ISDELETE: 1,
  });
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState([]);
  const [promotion, setPromotion] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchBrand();
    fetchPromotion();
  }, []);

  useEffect(() => {
    if (product) {
      const selectedCategory = product.ID_CATEGORY || null;

      setForm({
        ...product,
        selectedCategories: selectedCategory, // chỉ 1 ID
      });
    } else {
      setForm({
        selectedCategories: null, // không phải mảng nữa
        selectedPromotion: null,
        selectedBrand: null,

        UNIT: "Máy",
        METATITLE: "",
        SHORTDESCRIPTION: "",
        DESCRIPTION: "",
        METADESCRIPTION: "",

        NAME_PRODUCTDETAILS: "",
        PRICE_PRODUCTDETAILS: 0,
        AMOUNT_AVAILABLE: 0,
        SPECIFICATION: "",
        Import_Price: 0,

        GALLERYPRODUCT_DETAILS: null,
        ISDELETE: 1,
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/api/v1/admin/theloai/xemtatca`);
      setCategories(response.data.DT);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchBrand = async () => {
    try {
      const response = await axios.get(`${api}/api/v1/admin/brand/getAllBrand`);
      setBrand(response.data.DT);
    } catch (error) {
      console.error("Error fetching fetchBrand:", error);
    }
  };
  const fetchPromotion = async () => {
    try {
      const response = await axios.get(`${api}/api/v1/admin/promotion/getAllPromotion`);
      setPromotion(response.data.DT);
    } catch (error) {
      console.error("Error fetching fetchPromotion:", error);
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
  const handleSubmit = async () => {
    const requiredFields = [
      "NAME_PRODUCTDETAILS",
      "PRICE_PRODUCTDETAILS",
      "Import_Price",
      "AMOUNT_AVAILABLE",
      "UNIT",
      "METATITLE",
      "SHORTDESCRIPTION",
      "DESCRIPTION",
      "METADESCRIPTION",
      "SPECIFICATION",
    ];

    for (const field of requiredFields) {
      if (!form[field] && form[field] !== 0) {
        alert(`Vui lòng nhập ${field}`);
        return;
      }
    }

    if (!form.GALLERYPRODUCT_DETAILS) {
      alert("Vui lòng chọn một hình ảnh.");
      return;
    }

    const formData = new FormData();

    // Thêm dữ liệu cơ bản
    formData.append("NAME_PRODUCTDETAILS", form.NAME_PRODUCTDETAILS);
    formData.append("PRICE_PRODUCTDETAILS", form.PRICE_PRODUCTDETAILS);
    formData.append("Import_Price", form.Import_Price);
    formData.append("AMOUNT_AVAILABLE", form.AMOUNT_AVAILABLE);
    formData.append("UNIT", form.UNIT);
    formData.append("METATITLE", form.METATITLE);
    formData.append("SHORTDESCRIPTION", form.SHORTDESCRIPTION);
    formData.append("DESCRIPTION", form.DESCRIPTION);
    formData.append("METADESCRIPTION", form.METADESCRIPTION);
    formData.append("SPECIFICATION", form.SPECIFICATION);
    formData.append("ISDELETE", form.ISDELETE);

    // Thêm ảnh
    formData.append("GALLERYPRODUCT_DETAILS", form.GALLERYPRODUCT_DETAILS);

    // Convert mảng ID sang JSON string (nếu backend yêu cầu)
    formData.append("selectedCategories", JSON.stringify(form.selectedCategories));
    formData.append("selectedBrand", JSON.stringify(form.selectedBrand));
    formData.append("selectedPromotion", JSON.stringify(form.selectedPromotion));

    try {
      const url = product
        ? `${api}/api/v1/admin/sanpham/sua/${product.ID_PRODUCTDETAILS}`
        : `${api}/api/v1/admin/sanpham/tao`;

      const method = product ? "put" : "post";

      const response = await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.EC === 1) {
        fetchProducts();
        onClose();
      } else {
        alert(response.data.EM || "Lỗi không xác định từ server.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Đã xảy ra lỗi khi gửi dữ liệu.");
    }
  };

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

        <Grid container spacing={2}>
          {/* 1 cột (full width) */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.NAME_CATEGORY}
                value={
                  categories.find(
                    (category) => category.ID_CATEGORY === form.selectedCategories
                  ) || null
                }
                onChange={(event, newValue) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    selectedCategories: newValue ? newValue.ID_CATEGORY : null,
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Chọn thể loại" placeholder="Thêm thể loại" />
                )}
              />
            </FormControl>
          </Grid>

          {/* 2 cột */}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={promotion}
                getOptionLabel={(option) => option.NAME_PROMOTION}
                value={
                  promotion.find(
                    (promotionItem) => promotionItem.ID_PROMOTION === form.selectedPromotion
                  ) || null
                }
                onChange={(event, newValue) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    selectedPromotion: newValue ? newValue.ID_PROMOTION : null,
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Chọn khuyến mãi" placeholder="Thêm khuyến mãi" />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={brand}
                getOptionLabel={(option) => option.NAME}
                value={
                  brand.find(
                    (brandItem) => brandItem.ID_BRAND === form.selectedBrand
                  ) || null
                }
                onChange={(event, newValue) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    selectedBrand: newValue ? newValue.ID_BRAND : null,
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Chọn nhà sản xuất" placeholder="Thêm nhà sản xuất" />
                )}
              />
            </FormControl>
          </Grid>

          {/* Các ô input còn lại chia làm 2 cột tương tự */}
          <Grid item xs={6}>
            <TextField fullWidth label="Đơn vị" name="UNIT" value={form.UNIT} onChange={handleChange} required />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Tiêu đề" name="METATITLE" value={form.METATITLE} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Mô tả ngắn" name="SHORTDESCRIPTION" value={form.SHORTDESCRIPTION} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Mô tả" name="DESCRIPTION" value={form.DESCRIPTION} onChange={handleChange} required multiline rows={4} />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Mô tả hiển thị" name="METADESCRIPTION" value={form.METADESCRIPTION} onChange={handleChange} required />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Tên sản phẩm" name="NAME_PRODUCTDETAILS" value={form.NAME_PRODUCTDETAILS} onChange={handleChange} required />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Đơn giá" name="PRICE_PRODUCTDETAILS" type="number" value={form.PRICE_PRODUCTDETAILS} onChange={handleChange} required inputProps={{ min: "0" }} />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Tồn kho" name="AMOUNT_AVAILABLE" type="number" value={form.AMOUNT_AVAILABLE} onChange={handleChange} required inputProps={{ min: "0" }} />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth label="Giá nhập" name="Import_Price" type="number" value={form.Import_Price} onChange={handleChange} required inputProps={{ min: "0" }} />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Mô tả kỹ thuật" name="SPECIFICATION" value={form.SPECIFICATION} onChange={handleChange} required multiline rows={4} />
          </Grid>

          <Grid item xs={12}>
            <input
              type="file"
              name="GALLERYPRODUCT_DETAILS"
              accept="image/*"
              onChange={handleChange}
              style={{ marginTop: "16px", marginBottom: "16px" }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Select
              margin="dense"
              label="Trạng Thái"
              fullWidth
              name="ISDELETE"
              variant="outlined"
              value={form.ISDELETE}
              onChange={handleChange}
            >
              <MenuItem value="0">Đang kinh doanh</MenuItem>
              <MenuItem value="1">Ngưng kinh doanh</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <button className="btn btn-primary admin-btn" onClick={() => handleSubmit()}>
                {product ? "Cập nhật" : "Tạo mới"}
              </button>
              {product && (
                <button className="btn btn-danger admin-btn" onClick={() => onDelete(product)} style={{ marginLeft: "10px" }}>
                  Xóa
                </button>
              )}
              <button className="btn btn-danger admin-btn" onClick={onClose} style={{ marginLeft: "10px" }}>
                Huỷ
              </button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ProductModal;
