import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Để tránh lỗi khi dùng Chart.js 3+
import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Bar } from "react-chartjs-2";
import { Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Grid,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement
);

const api = process.env.REACT_APP_URL_SERVER;
const DonHangGame = () => {
  const [chartData2, setChartData2] = useState(null);
  const [userData, setUserData] = useState([]);
  const [donutData, setDonutData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [totalData, settotalData] = useState([]);

  const cards = [
    {
      icon: "bi-graph-up",
      title: "Tiền bán hôm nay",
      amount: (totalData?.results3?.[0]?.tong_tien_hom_nay || 0).toLocaleString("vi-VN") + " VNĐ",
    },
    {
      icon: "bi-bar-chart",
      title: "Tiền bán tháng này",
      amount: (totalData?.results4?.[0]?.tong_tien_thang_nay || 0).toLocaleString("vi-VN") + " VNĐ",
    },
    {
      icon: "bi-graph-down",
      title: "Tổng tiền",
      amount: (totalData?.results?.[0]?.tong_tien || 0).toLocaleString("vi-VN") + " VNĐ",
    },
    {
      icon: "bi-pie-chart-fill",
      title: "Khách mua nhiều nhất",
      amount: totalData?.results2?.[0]?.LASTNAME || "không có",
    },
  ];

  const chartData = {
    labels:
      barData && barData.length > 0 && barData.map((barData) => barData.MONTH), // Các nhãn trên trục X
    datasets: [
      {
        label: "Sales", // Tiêu đề cho dữ liệu
        data:
          barData &&
          barData.length > 0 &&
          barData.map((barData) => barData.PROFIT), // Dữ liệu biểu đồ
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Màu nền cột
        borderColor: "rgba(75, 192, 192, 1)", // Màu viền cột
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true, // Làm cho biểu đồ phản hồi theo kích thước màn hình
    plugins: {
      legend: {
        position: "top", // Vị trí của legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.dataset.label + ": " + context.raw;
          },
        },
      },
      title: {
        display: true, // Hiển thị tiêu đề
        text: "Lợi nhuận tháng", // Tiêu đề biểu đồ
        font: {
          size: 18, // Kích thước chữ của tiêu đề
          weight: "bold", // Định dạng chữ cho tiêu đề (có thể là 'normal', 'bold', 'italic', v.v.)
          family: "Arial", // Font chữ của tiêu đề
        },
        color: "white", // Màu chữ của tiêu đề
        padding: {
          top: 10, // Khoảng cách giữa tiêu đề và biểu đồ
          bottom: 30, // Khoảng cách giữa tiêu đề và biểu đồ
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
        grid: {
          color: "#444", // Màu của lưới trục Y (thay đổi màu sắc để phù hợp với nền xám)
        },
      },
      x: {
        grid: {
          color: "#444", // Màu của lưới trục X
        },
      },
    },
    layout: {
      padding: 10,
    },
    // Thiết lập màu nền của canvas và vùng biểu đồ
    backgroundColor: "#191C24", // Màu nền của canvas
    borderColor: "#191C24", // Màu viền của biểu đồ
    plot_bgcolor: "#191C24", // Màu nền vùng biểu đồ
    paper_bgcolor: "#191C24", // Màu nền của toàn bộ giấy
    font: {
      color: "white", // Màu chữ trắng để dễ đọc hơn
    },
  };

  const cardStyle = {
    backgroundColor: "#191C24", // Màu nền tối
    color: "white", // Màu chữ trắng
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    height: "100%",
    border: "none",
  };

  const iconStyle = {
    fontSize: "2rem",
    color: "red", // Màu của biểu tượng đỏ
    marginRight: "1rem",
  };

  // useEffect(() => {
  // Gọi API từ server Python để lấy dữ liệu biểu đồ
  // fetch("http://localhost:5000/api/chart")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     if (data.EM === "Success") {
  //       // Kiểm tra xem dữ liệu biểu đồ có đúng không
  //       console.log(data.DT);
  //       try {
  //         setChartData2(data.DT);
  //       } catch (e) {
  //         console.error("Error parsing chart data:", e);
  //       }
  //     } else {
  //       console.error("Error fetching chart:", data.EM);
  //     }
  //   })
  //   .catch((error) => console.error("Error fetching chart data:", error));
  // }, []);

  const fetchDatatable = async () => {
    const [responsedatauser, responsedatadonut, Responsebar, responseTotal, DuLieu_chartData] =
      await Promise.all([
        axios.get(`${api}/api/home/use/danhsachkhachhang`),
        axios.get(`${api}/api/home/use/tongsoluongcuatop3`),
        axios.get(`${api}/api/home/use/danhsachordertheotime`),
        axios.get(`${api}/api/home/use/laytongsoluongnhieunhat`),
        axios.get(`${api}/api/home/use/DuLieu_chartData`),
      ]);

    if (responsedatauser.data.EC === 1) {
      setUserData(responsedatauser.data.DT);
    }

    if (responsedatadonut.data.EC === 1) {
      setDonutData(responsedatadonut.data.DT);
    }
    if (Responsebar.data.EC === 1) {
      setBarData(Responsebar.data.DT);
    }
    if (responseTotal.data.EC === 1) {
      settotalData(responseTotal.data.DT);
    }
    if (DuLieu_chartData.data.EC === 1) {
      setChartData2(DuLieu_chartData.data.DT);
    }
  };

  useEffect(() => {
    fetchDatatable();
  }, []);

  const doughnutData = {
    labels:
      donutData &&
      donutData.length > 0 &&
      donutData.map((donutData) => donutData.BRAND_NAME),
    datasets: [
      {
        label: "Votes",
        data:
          donutData &&
          donutData.length > 0 &&
          donutData.map((donutData) => donutData.TOTAL_SOLD),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF8A80",
          "#81C784",
          "#FFD54F",
        ], // Thêm nhiều màu cho các phần
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF8A80",
          "#81C784",
          "#FFD54F",
        ], // Tương tự với hover
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#c9d1d9" }, // Màu chữ
      },
    },
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (user) => {
    // Logic for editing user
    console.log("Editing", user);
  };

  const handleDelete = (user) => {
    // Logic for deleting user
    console.log("Deleting", user);
  };

  return (
    <>
      {" "}
      <div>
        <Grid container spacing={2}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                style={{
                  ...cardStyle,
                  padding: "1rem",
                  backgroundColor: "#191C24",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <i className={`card-icon ${card.icon}`} style={iconStyle}></i>
                  <div style={{ marginLeft: "1rem" }}>
                    <h5 style={{ margin: 0, color: "#c9d1d9" }}>
                      {card.title}
                    </h5>
                    <p style={{ margin: 0, color: "#c9d1d9" }}>{card.amount}</p>
                  </div>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} marginTop={3}>
          <Grid item xs={12} md={6}>
            {chartData2 ? (
              <Plot
                data={chartData2.data}
                layout={chartData2.layout}
                style={{ width: "100%", height: "465px" }}
              />
            ) : (
              <p>Loading chart with python server...</p>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              style={{
                height: "100%",
                backgroundColor: "#191C24",
              }}
            >
              <Bar
                data={chartData}
                options={chartOptions}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#191C24",
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Table and Doughnut Chart Section */}
        <Grid container spacing={3} marginTop={3}>
          <Grid item xs={12} md={8}>
            <Paper
              style={{
                backgroundColor: "#191C24",
                padding: "20px",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#c9d1d9" }}>
                        Mã khách hàng
                      </TableCell>
                      <TableCell sx={{ color: "#c9d1d9" }}>Họ tên</TableCell>
                      <TableCell sx={{ color: "#c9d1d9" }}>Email</TableCell>
                      <TableCell sx={{ color: "#c9d1d9" }}>
                        Số điện thoại
                      </TableCell>
                      <TableCell sx={{ color: "#c9d1d9" }}>
                        Đơn hàng đã mua
                      </TableCell>
                      <TableCell sx={{ color: "#c9d1d9" }}>
                        Tổng số tiền đơn hàng đã mua
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user) => (
                        <TableRow key={user.ID_USER}>
                          <TableCell sx={{ color: "#c9d1d9" }}>
                            {user.ID_USER}
                          </TableCell>
                          <TableCell sx={{ color: "#c9d1d9" }}>
                            {(user.FIRSTNAME && user.LASTNAME) ? (user.FIRSTNAME + " " + user.LASTNAME) : "N/A"}
                          </TableCell>
                          <TableCell sx={{ color: "#c9d1d9" }}>
                            {user.EMAIL}
                          </TableCell>
                          <TableCell sx={{ color: "#c9d1d9" }}>
                            {user.PHONENUMBER}
                          </TableCell>
                          <TableCell sx={{ color: "#c9d1d9" }}>
                            {user.TOTAL_ORDERS}
                          </TableCell>
                          <TableCell sx={{ color: "#c9d1d9" }}>
                            {user.TOTAL_SPENT} VNĐ
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={userData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ color: "#c9d1d9" }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              style={{
                backgroundColor: "#191C24",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <h3 style={{ color: "#c9d1d9" }}>Theo hãng</h3>
              <Doughnut
                data={doughnutData}
                options={options}
                style={{
                  maxWidth: "550px",
                  maxHeight: "550px",
                  margin: "auto",
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default DonHangGame;
