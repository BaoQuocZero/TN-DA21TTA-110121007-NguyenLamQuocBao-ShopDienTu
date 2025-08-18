import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Rating,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
const ModalComment = ({ open, handleClose, selectGame, fetchGameList }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  console.log("selectGame", selectGame);
  const handleSubmit = async () => {
    if (!comment && !rating) {
      alert("Vui lòng nhập bình luận hoặc đánh giá");
      return;
    }
    const id = selectGame ? selectGame.MA_CTHD : null;
    try {
      await axios.put(`http://localhost:8081/binh-luan/${id}`, {
        BINH_LUAN: comment,
        DANH_GIA: rating,
      });
      enqueueSnackbar("Bình luận và đánh giá thành công", {
        variant: "success",
      });
      fetchGameList();
      handleClose();
    } catch (error) {
      console.error("Lỗi khi gửi bình luận và đánh giá:", error);
      alert("Có lỗi xảy ra khi gửi bình luận");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bình luận và Đánh giá</DialogTitle>
      <DialogContent>
        {/* Hiển thị thông tin game */}
        {selectGame && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <img
              src={`http://localhost:8081/images/${selectGame.image}`}
              alt={selectGame.title}
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: "8px",
                marginRight: 16,
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {selectGame.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {selectGame.categories}
              </Typography>
              <Typography variant="body2" sx={{ color: "#999" }}>
                Giá: {Number(selectGame.GIA_SP_KHI_MUA).toLocaleString("vi-VN")}
                đ
              </Typography>
            </Box>
          </Box>
        )}

        {/* Phần nhập bình luận */}
        <TextField
          fullWidth
          margin="dense"
          label="Bình luận"
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Phần đánh giá */}
        <Typography component="legend">Đánh giá</Typography>
        <Rating
          name="game-rating"
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          precision={1} // Cho phép chọn nửa sao nếu muốn
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalComment;
