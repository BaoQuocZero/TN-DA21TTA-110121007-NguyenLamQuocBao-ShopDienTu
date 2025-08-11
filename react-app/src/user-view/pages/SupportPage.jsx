import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    LinearProgress,
    Paper,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import { useSnackbar } from "notistack";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function SupportPage() {
    const { enqueueSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        category: "general",
        priority: "normal",
        message: "",
    });

    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);

    // Simple client-side validation
    const validate = () => {
        if (!form.name.trim()) return "Vui lòng nhập họ tên";
        if (!/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(form.email))
            return "Email không hợp lệ";
        if (!form.subject.trim()) return "Vui lòng nhập tiêu đề";
        if (form.message.trim().length < 10) return "Nội dung quá ngắn (>=10 ký tự)";
        return null;
    };

    const handleChange = (key) => (e) => {
        setForm((s) => ({ ...s, [key]: e.target.value }));
    };

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        // limit 5MB
        if (f.size > 5 * 1024 * 1024) {
            enqueueSnackbar("File quá lớn. Tối đa 5MB", { variant: "error" });
            e.target.value = null;
            return;
        }
        setFile(f);
    };

    const submitTicket = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) {
            enqueueSnackbar(err, { variant: "error" });
            return;
        }

        try {
            setSubmitting(true);
            setProgress(10);

            const formData = new FormData();
            formData.append("name", form.name.trim());
            formData.append("email", form.email.trim());
            formData.append("subject", form.subject.trim());
            formData.append("category", form.category);
            formData.append("priority", form.priority);
            formData.append("message", form.message.trim());
            if (file) formData.append("attachment", file);

            // example endpoint: POST /api/support/tickets
            const res = await axios.post(`${API_URL}/support/tickets`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (p) => {
                    const percent = Math.round((p.loaded * 100) / p.total);
                    setProgress(Math.max(20, percent));
                },
            });

            setProgress(100);

            if (res.data && res.data.EC === 1) {
                enqueueSnackbar("Gửi yêu cầu hỗ trợ thành công", { variant: "success" });
                setForm({ name: "", email: "", subject: "", category: "general", priority: "normal", message: "" });
                setFile(null);
            } else {
                const msg = (res.data && res.data.EM) || "Lỗi khi gửi yêu cầu";
                enqueueSnackbar(msg, { variant: "error" });
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Lỗi hệ thống khi gửi yêu cầu. Vui lòng thử lại sau.", { variant: "error" });
        } finally {
            setSubmitting(false);
            setProgress(0);
        }
    };

    const faqs = [
        {
            q: "Làm sao để thay đổi mật khẩu?",
            a: "Vào Trang thông tin > Mật khẩu & cài đặt. Nếu bạn quên mật khẩu, sử dụng chức năng 'Quên mật khẩu' để lấy lại.",
        },
        {
            q: "Bao lâu để nhận được phản hồi?",
            a: "Thời gian xử lý trung bình là 24-48 giờ trong ngày làm việc. Trường hợp khẩn cấp hãy gọi điện hoặc chọn priority 'high'.",
        },
        {
            q: "Làm thế nào để gửi chứng từ (hóa đơn, ảnh)?",
            a: "Trong form tạo ticket có mục đính kèm (attachment) cho phép upload ảnh hoặc PDF (tối đa 5MB).",
        },
    ];

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#0d1117", color: "#fff", py: 6 }}>
            <Container maxWidth="md">
                <Paper
                    elevation={2}
                    sx={{
                        p: { xs: 3, md: 5 },
                        bgcolor: "#1e1e2f", // sáng hơn #0f1720
                        color: "#fff"
                    }}
                >

                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <SupportAgentIcon sx={{ fontSize: 36, color: "#26bbff" }} />
                        <Box>
                            <Typography variant="h5">Trung tâm hỗ trợ</Typography>
                            <Typography variant="body2" color="gray">
                                Gửi yêu cầu, tạo ticket hoặc tham khảo phần Hỏi đáp nhanh.
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <form onSubmit={submitTicket}>
                                <TextField
                                    label="Họ và tên"
                                    value={form.name}
                                    onChange={handleChange("name")}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ style: { color: "#cfd8dc" } }}
                                    sx={{
                                        backgroundColor: "#111419",
                                        '& .MuiInputBase-input': { color: '#fff' },
                                    }}
                                />

                                <TextField
                                    label="Email"
                                    value={form.email}
                                    onChange={handleChange("email")}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ style: { color: "#cfd8dc" } }}
                                    sx={{ backgroundColor: "#111419", '& .MuiInputBase-input': { color: '#fff' } }}
                                />

                                <TextField
                                    label="Tiêu đề"
                                    value={form.subject}
                                    onChange={handleChange("subject")}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ style: { color: "#cfd8dc" } }}
                                    sx={{ backgroundColor: "#111419", '& .MuiInputBase-input': { color: '#fff' } }}
                                />

                                <FormControl fullWidth margin="normal" sx={{ backgroundColor: '#111419' }}>
                                    <InputLabel sx={{ color: '#cfd8dc' }}>Chuyên mục</InputLabel>
                                    <Select value={form.category} label="Chuyên mục" onChange={handleChange('category')} sx={{ color: '#fff' }}>
                                        <MenuItem value="general">Tổng quát</MenuItem>
                                        <MenuItem value="billing">Thanh toán</MenuItem>
                                        <MenuItem value="technical">Kỹ thuật</MenuItem>
                                        <MenuItem value="account">Tài khoản</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="normal" sx={{ backgroundColor: '#111419' }}>
                                    <InputLabel sx={{ color: '#cfd8dc' }}>Độ ưu tiên</InputLabel>
                                    <Select value={form.priority} label="Độ ưu tiên" onChange={handleChange('priority')} sx={{ color: '#fff' }}>
                                        <MenuItem value="low">Thấp</MenuItem>
                                        <MenuItem value="normal">Bình thường</MenuItem>
                                        <MenuItem value="high">Cao</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Mô tả chi tiết"
                                    value={form.message}
                                    onChange={handleChange("message")}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    minRows={5}
                                    InputLabelProps={{ style: { color: "#cfd8dc" } }}
                                    sx={{ backgroundColor: "#111419", '& .MuiInputBase-input': { color: '#fff' } }}
                                />

                                <Box display="flex" alignItems="center" gap={1} mt={1}>
                                    <IconButton component="label" size="small" sx={{ color: '#cfd8dc', backgroundColor: '#0f1720' }}>
                                        <AttachFileIcon />
                                        <input hidden type="file" accept="image/*,application/pdf" onChange={handleFile} />
                                    </IconButton>
                                    <Typography variant="body2" color="gray">
                                        {file ? file.name : "Đính kèm (ảnh, pdf) - tối đa 5MB"}
                                    </Typography>
                                </Box>

                                {submitting && <LinearProgress sx={{ my: 2 }} variant="determinate" value={progress} />}

                                <Box display="flex" gap={2} mt={3}>
                                    <Button type="submit" variant="contained" disabled={submitting} startIcon={<SendIcon />} sx={{ backgroundColor: '#26bbff' }}>
                                        Gửi yêu cầu
                                    </Button>

                                    <Button variant="outlined" disabled={submitting} onClick={() => { setForm({ name: '', email: '', subject: '', category: 'general', priority: 'normal', message: '' }); setFile(null); }}>
                                        Hủy
                                    </Button>
                                </Box>
                            </form>

                            <Box mt={4}>
                                <Typography variant="h6" sx={{ color: "#fff" }}>
                                    Các kênh liên hệ khác
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <PhoneIcon sx={{ mr: 1, color: "#26bbff" }} />
                                        <ListItemText
                                            primary="Hotline: 1900-0000"
                                            secondary="(Giờ hành chính 8:00 - 17:00)"
                                            primaryTypographyProps={{ sx: { color: "#fff" } }}
                                            secondaryTypographyProps={{ sx: { color: "#ccc" } }} // đổi secondary sáng hơn
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <EmailIcon sx={{ mr: 1, color: "#26bbff" }} />
                                        <ListItemText
                                            primary="Email: support@example.com"
                                            secondary="Phản hồi qua email"
                                            primaryTypographyProps={{ sx: { color: "#fff" } }}
                                            secondaryTypographyProps={{ sx: { color: "#ccc" } }}
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" mb={2}>Hỏi đáp nhanh (FAQ)</Typography>

                            {faqs.map((f, i) => (
                                <Accordion key={i} sx={{ backgroundColor: '#0f1720', color: '#fff', mb: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#cfd8dc' }} />}>
                                        <Typography>{f.q}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography color="gray">{f.a}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6">Trạng thái hệ thống</Typography>
                            <Typography variant="body2" color="gray" mt={1}>
                                Không có sự cố lớn nào được ghi nhận trong vòng 24 giờ gần nhất.
                            </Typography>

                            <Box mt={3}>
                                <Typography variant="h6">Cam kết hỗ trợ</Typography>
                                <Typography variant="body2" color="gray" mt={1}>
                                    Chúng tôi cam kết phản hồi trong vòng 24-48 giờ làm việc. Nếu vấn đề ảnh hưởng nghiêm trọng, chọn độ ưu tiên "Cao" hoặc gọi hotline.
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" color="gray">Bạn cần hỗ trợ khẩn cấp?</Typography>
                            <Button variant="contained" sx={{ mt: 1, backgroundColor: '#ff6b6b' }} startIcon={<PhoneIcon />}>Gọi ngay</Button>

                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}