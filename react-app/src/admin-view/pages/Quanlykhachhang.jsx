import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { getThemeConfig } from "../../service/themeService";
import AddressSelector from "../../user-view/components/addressUser";
import { enqueueSnackbar } from "notistack";

const DanhSachNguoiDungAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // User được chọn để chỉnh sửa
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Trạng thái mở/đóng của form
    const currentTheme = getThemeConfig(localStorage.getItem("THEMES") || "dark");
    const api = process.env.REACT_APP_URL_SERVER;

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWards, setSelectedWards] = useState(null);
    const [phanQuyen, setPhanQuyen] = useState([]);
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_URL_SERVER}/api/user`
            );
            if (response.data.EC === 1) {
                setUsers(response.data.DT);
            }
            const responsePhanQuyen = await axios.get(
                `${api}/api/v1/admin/taikhoan/phanquyen`
            );
            if (responsePhanQuyen.data.EC === 1) {
                setPhanQuyen(responsePhanQuyen.data.DT);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Hàm mở dialog và hiển thị thông tin người dùng
    const handleEditClick = (user) => {
        // setSelectedProvince(user.DIA_CHI_Provinces);
        // setSelectedDistrict(user.DIA_CHI_Districts);
        // setSelectedWards(user.DIA_CHI_Wards);
        setSelectedUser(user);
        console.log("user: ", user)
        setIsDialogOpen(true);
    };

    // Hàm cập nhật thông tin người dùng
    const handleSave = async () => {
        console.log("selectedUser trước khi cập nhật:", selectedUser);

        // Cập nhật địa chỉ vào selectedUser
        const updatedUser = {
            ...selectedUser,
            DIA_CHI_Provinces: selectedProvince?.full_name || "",
            DIA_CHI_Districts: selectedDistrict?.full_name || "",
            DIA_CHI_Wards: selectedWards?.full_name || "",
            DIA_CHI:
                selectedUser?.DIA_CHI_STREETNAME &&
                    selectedProvince?.full_name &&
                    selectedDistrict?.full_name &&
                    selectedWards?.full_name
                    ? `${selectedUser.DIA_CHI_STREETNAME}, ${selectedWards.full_name}, ${selectedDistrict.full_name}, ${selectedProvince.full_name}`
                    : "",
        };

        console.log("selectedUser sau khi cập nhật:", updatedUser);

        try {
            const response = await axios.put(
                `${api}/khach-hang/updateUser/${selectedUser.MA_KH}`,
                updatedUser
            );
            if (response.data.EC === 1) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.MA_KH === updatedUser.MA_KH ? updatedUser : user
                    )
                );
                enqueueSnackbar(response.data.EM, { variant: "success" });
                fetchUsers();
                setIsDialogOpen(false);
            } else {
                enqueueSnackbar(response.data.EM, { variant: "error" });
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Hàm đóng dialog
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    // Hàm xử lý thay đổi của form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    if (loading) {
        return <Typography variant="h6">Đang tải...</Typography>;
    }

    if (error) {
        return (
            <Typography variant="h6" color="error">
                {error}
            </Typography>
        );
    }

    return (
        <Box
            // display="flex"
            style={{
                minHeight: "100vh",
                backgroundColor: currentTheme.backgroundColor,
                color: currentTheme.color,
            }}
        >
            <Typography
                variant="h5"
                mt={4}
                color="primary"
                sx={{ textAlign: "left" }}
                gutterBottom
            >
                Quản lý người dùng
            </Typography>

            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: currentTheme.backgroundColor,
                    color: currentTheme.color,
                    borderRadius: "8px",
                    boxShadow: "none",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: currentTheme.color }}> </TableCell>
                            <TableCell sx={{ color: currentTheme.color }}>Họ Tên</TableCell>
                            <TableCell sx={{ color: currentTheme.color }}>Email</TableCell>
                            <TableCell sx={{ color: currentTheme.color }}>
                                Số điện thoại
                            </TableCell>
                            <TableCell sx={{ color: currentTheme.color }}>Vai Trò</TableCell>
                            <TableCell sx={{ color: currentTheme.color }}>
                                Trạng thái
                            </TableCell>
                            <TableCell sx={{ color: currentTheme.color }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.MA_KH}>
                                <TableCell>
                                    <Avatar
                                        src={user.AVATAR ? `${api}/images/${user.AVATAR}` : ""}
                                        alt={user.name || "User"}
                                    >
                                        {!user.AVATAR && <PeopleIcon />}
                                    </Avatar>
                                </TableCell>

                                <TableCell sx={{ color: currentTheme.color }}>
                                    {user.LASTNAME} {user.FIRSTNAME}
                                </TableCell>

                                <TableCell sx={{ color: currentTheme.color }}>
                                    {user.EMAIL}
                                </TableCell>
                                <TableCell sx={{ color: currentTheme.color }}>
                                    {user.PHONENUMBER}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: user.ID_ROLE === "1" ? "red" : "green",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {user.NAME_ROLE}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: user.ISDELETE === 0 ? "green" : "red",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {user.ISDELETE === 0 ? "Đang hoạt động" : "Ngưng hoạt động"}
                                </TableCell>

                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog cập nhật người dùng */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Cập nhật thông tin người dùng</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Họ"
                        name="FIRSTNAME"
                        value={selectedUser?.FIRSTNAME || ""}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Tên"
                        name="LASTNAME"
                        value={selectedUser?.LASTNAME || ""}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="PHONENUMBER"
                        value={selectedUser?.PHONENUMBER || ""}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="ADDRESS"
                        name="ADDRESS"
                        value={selectedUser?.ADDRESS || ""}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="vai-tro-label">Vai Trò</InputLabel>
                        <Select
                            labelId="vai-tro-label"
                            id="vai-tro-select"
                            label="Vai trò"
                            name="ID_ROLE"
                            value={selectedUser?.ID_ROLE || ""}
                            onChange={handleInputChange}
                        >
                            {phanQuyen.map((role) => (
                                <MenuItem key={role.ID_ROLE} value={role.ID_ROLE}>
                                    {role.NAME_ROLE}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="vai-tro-label">Trạng thái tài khoản</InputLabel>
                        <Select
                            labelId="trang-thai-label"
                            id="trang-thai-select"
                            label="Trạng thái tài khoản"
                            name="ISDELETE"
                            value={selectedUser?.ISDELETE ?? ""}
                            onChange={handleInputChange}
                        >
                            <MenuItem value={0}>Ngưng hoạt động</MenuItem>
                            <MenuItem value={1}>Đang hoạt động</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DanhSachNguoiDungAdmin;
