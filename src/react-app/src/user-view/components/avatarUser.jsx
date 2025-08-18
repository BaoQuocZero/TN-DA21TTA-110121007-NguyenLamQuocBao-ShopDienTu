import React, { useState } from "react";
import {
  Box,
  IconButton,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { login } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
const api = process.env.REACT_APP_URL_SERVER;

const AvatarChanger = ({ currentAvatar, onAvatarChange, userId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleAvatarChange = async () => {
    const formData = new FormData();
    formData.append("images", file); // Thêm ảnh vào formData
    console.log("userId", userId);
    try {
      const response = await axios.put(
        `${api}/api/v1/KhachHang/${userId}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
      }
    } catch (error) {
      console.error(
        "Error changing avatar:",
        error.response?.data || error.message
      );
    }
    onAvatarChange(file);
    setOpenDialog(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {/* Avatar hiện tại */}
      <Avatar
        src={file ? URL.createObjectURL(file) : currentAvatar}
        sx={{ width: 100, height: 100 }}
      />
      <IconButton
        color="primary"
        onClick={() => setOpenDialog(true)}
        sx={{ marginTop: 2 }}
      >
        <CameraAlt />
      </IconButton>

      {/* Dialog thay đổi avatar */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Thay đổi Avatar</DialogTitle>
        <DialogContent>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #3f51b5",
              padding: 3,
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            <p>Kéo và thả hoặc chọn ảnh mới</p>
          </Box>
          {file && (
            <Box display="flex" justifyContent="center" marginTop={2}>
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleAvatarChange} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvatarChanger;
