import { useRoutes, Navigate } from "react-router-dom";

import Admin from "./pages/DashboardAdmin";
import DonHangGame from "./pages/DonHang";
import ProductManagement from "./pages/Quanlysanpham";
import Quanlytheloai from "./pages/Quanlytheloai";
import TatCaDonHangAdminProcess from "./pages/QuanLyDonHangProcess";
import QuanLySanPhamUuTien from "./pages/QuanLySanPhamUuTien";
import Quanlykhachhang from "./pages/Quanlykhachhang";
import BinhLuanManager from "./pages/Quanlybinhluan";
import QuanlythanhToan from "./pages/Quanlythanhtoan";
import TatCaDonHangAdminSuccess from "./pages/QuanLyDonHangSuccess";
const AdminRouter = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <DonHangGame />,
    },
    {
      path: "/sanpham-uutien",
      element: <QuanLySanPhamUuTien />,
    },
    {
      path: "/quan-ly-user",
      element: <Admin />,
    },
    {
      path: "/quanlysanpham",
      element: <ProductManagement />,
    },
    {
      path: "/quanlytheloai",
      element: <Quanlytheloai />,
    },
    {
      path: "/don-hang-dang-xu-ly",
      element: <TatCaDonHangAdminProcess />,
    },
    {
      path: "/don-hang-giao-dich-thanh-cong",
      element: <TatCaDonHangAdminSuccess />,
    },
    {
      path: "/quanlykhachhang",
      element: <Quanlykhachhang />,
    },
    {
      path: "/quanlybinhluan",
      element: <BinhLuanManager />,
    },
    {
      path: "/lichsudonhang",
      element: <QuanlythanhToan />,
    },
    {
      path: "/quanlythanhtoan",
      element: <QuanlythanhToan />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default AdminRouter;
