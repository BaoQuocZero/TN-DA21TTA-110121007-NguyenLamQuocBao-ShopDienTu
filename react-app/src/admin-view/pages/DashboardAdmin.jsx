import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
const Admin = () => {
  return (
    <Box
      display="flex"
      style={{
        minHeight: "100vh",
        backgroundColor: "#101014",
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
        <Typography variant="h5" gutterBottom>
          Account Settings
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Manage your account’s details.
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <TextField
            label="Address Line 2"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
            }}
          />
          <TextField
            label="Address Line 2"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
              ml: 2,
            }}
          />
        </Box>

        <FormControl
          fullWidth
          variant="outlined"
          style={{ marginBottom: "20px" }}
        >
          <InputLabel style={{ color: "#fff" }}>
            Preferred Communication Language
          </InputLabel>
          <Select
            defaultValue="English"
            sx={{
              color: "#fff", // Màu chữ
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3d444d", // Màu viền
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3d444d", // Màu viền khi hover
              },
              "& .MuiSelect-icon": {
                color: "#fff", // Màu icon
              },
              backgroundColor: "#151b23",
            }}
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Vietnamese">Vietnamese</MenuItem>
          </Select>
          <Typography
            variant="caption"
            style={{ marginTop: "5px", color: "#fff" }}
          >
            Choose your preferred language for emails from Epic Games.
          </Typography>
        </FormControl>

        <Typography
          variant="h6"
          style={{ marginBottom: "20px", color: "#fff" }}
        >
          Personal Details
        </Typography>
        <Box display="flex" gap={2} mb={4}>
          <TextField
            label="First Name"
            variant="outlined"
            defaultValue="P***c"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
            }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            defaultValue="H***g"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
            }}
          />
        </Box>

        <Typography
          variant="h6"
          style={{ marginBottom: "20px", color: "#fff" }}
        >
          Address
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Address Line 1"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
            }}
          />
          <TextField
            label="Address Line 2"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
            }}
          />{" "}
          <TextField
            label="Address Line 2"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
            }}
          />
        </Box>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
            }}
          />
          <TextField
            label="State/Province"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
            }}
          />
        </Box>
        <Box display="flex" gap={2} mb={4}>
          <TextField
            label="Postal Code"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
            }}
          />
          <TextField
            label="Country"
            variant="outlined"
            defaultValue="Vietnam"
            fullWidth
            InputProps={{
              style: { color: "#fff" }, // Màu chữ trong TextField
            }}
            InputLabelProps={{
              style: { color: "#fff" }, // Màu chữ nhãn
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#3d444d", // Màu viền
                  backgroundColor: "#151b23",
                },
                "&:hover fieldset": {
                  borderColor: "#3d444d", // Màu viền khi hover
                },
              },
            }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "20px", backgroundColor: "#26bbff" }} // Đặt màu nền cho button
        >
          Save Changes
        </Button>
      </Container>
    </Box>
  );
};

export default Admin;
