-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th9 17, 2025 lúc 10:08 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `kltn`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brand`
--

CREATE TABLE `brand` (
  `ID_BRAND` int(11) NOT NULL,
  `NAME` varchar(255) DEFAULT NULL,
  `DESCRIPTION` text DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `brand`
--

INSERT INTO `brand` (`ID_BRAND`, `NAME`, `DESCRIPTION`, `CREATEAT`, `UPDATEAT`, `ISDELETE`) VALUES
(1, 'ASUS', 'Thương hiệu nổi tiếng với laptop gaming, linh kiện máy tính', '2025-06-09 14:22:39', '2025-06-09 14:22:39', 0),
(2, 'Dell', 'Thương hiệu máy tính văn phòng, doanh nghiệp hàng đầu', '2025-06-09 14:22:39', '2025-06-09 14:22:39', 0),
(3, 'HP', 'Chuyên sản xuất laptop và thiết bị văn phòng', '2025-06-09 14:22:39', '2025-06-09 14:22:39', 0),
(4, 'Logitech', 'Thương hiệu phụ kiện máy tính: chuột, bàn phím, tai nghe', '2025-06-09 14:22:39', '2025-06-09 14:22:39', 0),
(5, 'MSI', 'Laptop, bo mạch chủ và thiết bị chơi game hiệu năng cao', '2025-06-09 14:22:39', '2025-06-09 14:22:39', 0),
(6, 'Acer', 'Laptop giá tốt, cấu hình ổn định, phù hợp sinh viên', '2025-06-09 14:22:39', '2025-06-09 14:22:39', 0),
(7, 'Lenovo', 'Laptop và PC cho doanh nghiệp, học sinh, sinh viên', '2025-06-09 14:22:39', '2025-06-09 14:22:39', 0),
(8, 'Gigabyte', 'Bo mạch chủ, card đồ họa và thiết bị chơi game', '2025-06-09 14:22:39', '2025-06-09 14:22:39', 0),
(9, 'Razer', 'Phụ kiện chơi game cao cấp như chuột, bàn phím, tai nghe', '2025-06-09 14:22:39', '2025-06-09 14:22:39', 0),
(10, 'Kingston', 'RAM và ổ cứng SSD uy tín trên toàn cầu', '2025-06-09 14:22:39', '2025-06-09 14:22:39', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `ID_CART` int(11) NOT NULL,
  `ID_USER` int(11) NOT NULL,
  `CODENAME` varchar(255) DEFAULT NULL,
  `DESCRIPTION` text DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart`
--

INSERT INTO `cart` (`ID_CART`, `ID_USER`, `CODENAME`, `DESCRIPTION`, `CREATEAT`, `UPDATEAT`, `ISDELETE`) VALUES
(1, 4, NULL, NULL, '2025-08-15 19:31:58', '2025-08-15 19:31:58', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_item`
--

CREATE TABLE `cart_item` (
  `ID_CARTITEMS` int(11) NOT NULL,
  `ID_PRODUCTDETAILS` int(11) NOT NULL,
  `ID_CART` int(11) NOT NULL,
  `QUANTITY` int(11) DEFAULT NULL,
  `TOTAL_PRICE` float DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `ID_CATEGORY` int(11) NOT NULL,
  `NAME_CATEGORY` varchar(255) DEFAULT NULL,
  `SLUG` varchar(255) DEFAULT NULL,
  `DESCRIPTION` text DEFAULT NULL,
  `PARENTID` int(11) DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`ID_CATEGORY`, `NAME_CATEGORY`, `SLUG`, `DESCRIPTION`, `PARENTID`, `CREATEAT`, `UPDATEAT`, `ISDELETE`) VALUES
(1, 'Laptop', 'laptop', 'Các dòng laptop từ phổ thông đến cao cấp', NULL, '2025-06-09 14:14:11', '2025-08-06 02:50:32', 0),
(2, 'PC', 'pc', 'Máy tính để bàn, PC Gaming, văn phòng', NULL, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(3, 'Phụ kiện', 'phu-kien', 'Các loại phụ kiện cho laptop, PC và thiết bị công nghệ', NULL, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(4, 'Laptop Gaming', 'laptop-gaming', 'Laptop chuyên dùng cho chơi game, cấu hình cao', 1, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(5, 'Laptop Văn Phòng', 'laptop-van-phong', 'Laptop mỏng nhẹ, pin tốt cho dân văn phòng', 1, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(6, 'Laptop Đồ Họa', 'laptop-do-hoa', 'Laptop cho dân thiết kế, render video', 1, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(7, 'PC Gaming', 'pc-gaming', 'Máy tính chơi game cấu hình cao', 2, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(8, 'PC Văn Phòng', 'pc-van-phong', 'Máy tính làm việc văn phòng, tiết kiệm điện', 2, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(9, 'Chuột Máy Tính', 'chuot-may-tinh', 'Chuột gaming, không dây, văn phòng', 3, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(10, 'Bàn Phím', 'ban-phim', 'Bàn phím cơ, giả cơ, không dây', 3, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(11, 'Tai Nghe', 'tai-nghe', 'Tai nghe gaming, Bluetooth, có dây', 3, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(12, 'Màn Hình', 'man-hinh', 'Màn hình máy tính các loại', 3, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(13, 'Ổ Cứng', 'o-cung', 'Ổ cứng SSD, HDD', 3, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(14, 'Ram', 'ram', 'Ram cho laptop và PC', 3, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
(17, 'Linh kiện', 'linh-kien', 'Linh kiện máy tính', NULL, '2025-09-04 08:06:33', '2025-09-04 08:06:33', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comment`
--

CREATE TABLE `comment` (
  `ID_COMMENT` int(11) NOT NULL,
  `ID_PRODUCTDETAILS` int(11) NOT NULL,
  `ID_USER` int(11) NOT NULL,
  `CONTENT_COMMENT` text DEFAULT NULL,
  `STATUS` varchar(255) DEFAULT NULL,
  `RATING` float DEFAULT NULL,
  `ISSHOW` tinyint(1) DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comment`
--

INSERT INTO `comment` (`ID_COMMENT`, `ID_PRODUCTDETAILS`, `ID_USER`, `CONTENT_COMMENT`, `STATUS`, `RATING`, `ISSHOW`, `CREATEAT`, `UPDATEAT`, `ISDELETE`) VALUES
(3, 29, 4, 'Sản phẩm rất tốt nghe ổn', 'Đã duyệt', 5, 1, '2025-09-17 12:38:45', '2025-09-17 12:38:45', 0),
(4, 29, 4, 'Mau hỏng', 'Đã duyệt', 1, 1, '2025-09-17 12:45:34', '2025-09-17 12:45:34', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `ID_ORDER` int(11) NOT NULL,
  `ID_USER` int(11) NOT NULL,
  `QUANTITY` int(11) DEFAULT NULL,
  `STATUS` varchar(255) DEFAULT NULL,
  `PAYMENTSTATUS` varchar(255) DEFAULT NULL,
  `PAYMENTMETHOD` varchar(255) DEFAULT NULL,
  `TOTALORDERPRICE` float DEFAULT NULL,
  `DISCOUNTEDVOUCHERAMOUNT` float DEFAULT NULL,
  `PRICEAFTERVOUCHER` float DEFAULT NULL,
  `SHIPPING_ADDRESS` varchar(255) DEFAULT NULL,
  `SHIPPING_PHONE` varchar(20) DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`ID_ORDER`, `ID_USER`, `QUANTITY`, `STATUS`, `PAYMENTSTATUS`, `PAYMENTMETHOD`, `TOTALORDERPRICE`, `DISCOUNTEDVOUCHERAMOUNT`, `PRICEAFTERVOUCHER`, `SHIPPING_ADDRESS`, `SHIPPING_PHONE`, `CREATEAT`, `UPDATEAT`, `ISDELETE`) VALUES
(81, 4, 2, 'Đã giao hàng', 'Đã thanh toán', 'Chuyển khoản', 15199000, NULL, NULL, 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '0372701722', '2025-08-04 05:20:20', '2025-09-04 05:31:15', 0),
(82, 4, 3, 'Đã giao hàng', 'Đã thanh toán', 'Chuyển khoản', 33619000, NULL, NULL, 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '0372701722', '2025-07-04 05:20:53', '2025-09-04 13:39:15', 0),
(83, 4, 1, 'Đang chờ xác nhận', 'Chưa thanh toán', 'Thanh toán COD', 39600100, NULL, NULL, 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '0372701722', '2025-06-04 11:37:02', NULL, 0),
(84, 4, 1, 'Đang chờ xác nhận', 'Chưa thanh toán', 'Thanh toán COD', 19690000, NULL, NULL, 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '0372701722', '2025-05-04 11:37:09', NULL, 0),
(85, 4, 1, 'Đang chờ xác nhận', 'Chưa thanh toán', 'Thanh toán COD', 7280000, NULL, NULL, 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '0372701722', '2025-04-04 11:37:16', NULL, 0),
(86, 4, 1, 'Đang chờ xác nhận', 'Chưa thanh toán', 'Thanh toán COD', 7280000, NULL, NULL, 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '0372701722', '2025-03-04 11:37:27', NULL, 0),
(87, 4, 1, 'Đang chờ xác nhận', 'Chưa thanh toán', 'Chuyển khoản', 39600100, NULL, NULL, 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '0372701722', '2025-09-04 13:27:41', NULL, 0),
(88, 5, 1, 'Đang chờ xác nhận', 'Chưa thanh toán', 'Chuyển khoản', 39600100, NULL, NULL, 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '0372701722', '2025-09-04 13:45:15', NULL, 0),
(89, 5, 1, 'Đang chờ xác nhận', 'Chưa thanh toán', 'Chuyển khoản', 39600100, NULL, NULL, 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '0372701722', '2025-09-04 13:45:42', NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_item`
--

CREATE TABLE `order_item` (
  `ID_ORDERITEM` int(11) NOT NULL,
  `ID_PRODUCTDETAILS` int(11) NOT NULL,
  `ID_ORDER` int(11) NOT NULL,
  `QUANTITY` int(11) DEFAULT NULL,
  `UNIT_PRICE` float DEFAULT NULL,
  `TOTAL_PRICE` float DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_item`
--

INSERT INTO `order_item` (`ID_ORDERITEM`, `ID_PRODUCTDETAILS`, `ID_ORDER`, `QUANTITY`, `UNIT_PRICE`, `TOTAL_PRICE`, `CREATEAT`, `UPDATEAT`, `ISDELETE`) VALUES
(92, 7, 81, 1, 14990000, 14990000, '2025-08-04 05:20:20', NULL, 0),
(93, 8, 81, 1, 209000, 209000, '2025-08-04 05:20:20', NULL, 0),
(94, 9, 82, 1, 730000, 730000, '2025-07-04 05:20:53', NULL, 0),
(95, 10, 82, 1, 17899000, 17899000, '2025-07-04 05:20:53', NULL, 0),
(96, 7, 82, 1, 14990000, 14990000, '2025-07-04 05:20:53', NULL, 0),
(97, 18, 83, 1, 39600100, 39600100, '2025-06-04 11:37:02', NULL, 0),
(98, 27, 84, 1, 19690000, 19690000, '2025-05-04 11:37:09', NULL, 0),
(99, 16, 85, 1, 7280000, 7280000, '2025-04-04 11:37:16', NULL, 0),
(100, 16, 86, 1, 7280000, 7280000, '2025-03-04 11:37:27', NULL, 0),
(101, 18, 87, 1, 39600100, 39600100, '2025-09-04 13:27:41', NULL, 0),
(102, 18, 88, 1, 39600100, 39600100, '2025-09-04 13:45:15', NULL, 0),
(103, 18, 89, 1, 39600100, 39600100, '2025-09-04 13:45:42', NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `ID_PRODUCT` int(11) NOT NULL,
  `ID_PROMOTION` int(11) NOT NULL,
  `ID_CATEGORY` int(11) NOT NULL,
  `ID_BRAND` int(11) NOT NULL,
  `NAMEPRODUCT` varchar(255) DEFAULT NULL,
  `SLUG` varchar(255) DEFAULT NULL,
  `STATUS` varchar(255) DEFAULT NULL,
  `UNIT` varchar(255) DEFAULT NULL,
  `METATITLE` varchar(1000) DEFAULT NULL,
  `SHORTDESCRIPTION` varchar(1000) DEFAULT NULL,
  `DESCRIPTION` text DEFAULT NULL,
  `METADESCRIPTION` varchar(1000) DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `GALLERYPRODUCT` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`ID_PRODUCT`, `ID_PROMOTION`, `ID_CATEGORY`, `ID_BRAND`, `NAMEPRODUCT`, `SLUG`, `STATUS`, `UNIT`, `METATITLE`, `SHORTDESCRIPTION`, `DESCRIPTION`, `METADESCRIPTION`, `ISDELETE`, `CREATEAT`, `UPDATEAT`, `GALLERYPRODUCT`) VALUES
(8, 1, 7, 1, 'PC 4K GAMING RTX 4070 12400F (ALL NEW - BH 36 tháng) - 4 Slots order - 2 Hà Nội -2 HCM', 'bộ-máy-đồ-họa-asus-tuf--core-i9-12900k---32gb---512-ssd---vga-6600-8gb-dùng-adobe,-autocad,-3dsmax,-render,-gaming', '1', 'Máy', 'PC 4K GAMING RTX 4070 12400F (ALL NEW - BH 36 tháng) - 4 Slots order - 2 Hà Nội -2 HCM', 'PC 4K GAMING RTX 4070 12400F (ALL NEW - BH 36 tháng) - 4 Slots order - 2 Hà Nội -2 HCM', 'Máy tính để bàn, PC Gaming, văn phòng', 'PC 4K GAMING RTX 4070 12400F (ALL NEW - BH 36 tháng) - 4 Slots order - 2 Hà Nội -2 HCM', 0, '2025-06-15 17:32:22', '2025-09-04 10:08:50', 'GALLERYPRODUCT_DETAILS-1756953108708.jpg'),
(9, 1, 1, 7, 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 'laptop-lenovo-ideapad-slim-3-15irh10-i5-13420h/16gb/512gb/win11-(83k1000hvn)', '1', 'Máy', 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 0, '2025-06-15 17:36:12', '2025-06-15 17:36:12', 'GALLERYPRODUCT_DETAILS-1749983772252.jpg'),
(10, 1, 9, 4, 'Chuột Zadez Gaming có dây G-156M', 'chuột-zadez-gaming-có-dây-g-156m', '1', 'Máy', 'Chuột Zadez Gaming có dây G-156M', 'Chuột Zadez Gaming có dây G-156M', 'Chuột Zadez Gaming có dây G-156M', 'Chuột Zadez Gaming có dây G-156M', 0, '2025-06-15 17:37:55', '2025-06-15 17:37:55', 'GALLERYPRODUCT_DETAILS-1749983875619.webp'),
(11, 1, 11, 9, 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 'tai-nghe-bluetooth-onikuma-k9-rgb-tai-mèo', '1', 'Máy', 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 0, '2025-06-15 17:39:31', '2025-06-15 17:39:31', 'GALLERYPRODUCT_DETAILS-1749983971161.webp'),
(12, 1, 12, 1, 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 'màn-hình-quảng-cáo-chân-đứng-49-inch-chính-hãng-lux-vision', '1', 'Máy', 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 0, '2025-06-15 17:40:51', '2025-06-15 17:40:51', 'GALLERYPRODUCT_DETAILS-1749984051539.jpg'),
(14, 1, 1, 7, 'Laptop Lenovo LOQ 15IAX9E 83LK0079VN', 'laptop-lenovo-loq-15iax9e-83lk0079vn', '1', 'Máy', 'Laptop Lenovo LOQ 15IAX9E 83LK0079VN', 'Laptop Lenovo LOQ 15IAX9E 83LK0079VN', 'Laptop Lenovo LOQ 15IAX9E 83LK0079VN', 'Laptop Lenovo LOQ 15IAX9E 83LK0079VN', 0, '2025-09-04 07:10:40', '2025-09-04 07:10:40', 'GALLERYPRODUCT_DETAILS-1756944640279.webp'),
(15, 1, 2, 8, 'PC FASTER GAMING i5 11400F - RTX 3050 6GB ( ALL NEW- Bảo hành 36 Tháng)- 34 slots- 10 HN- 14 HCM', 'pc-faster-gaming-i5-11400f---rtx-3050-6gb-(-all-new--bảo-hành-36-tháng)--34-slots--10-hn--14-hcm', '1', 'Máy', 'PC FASTER GAMING i5 11400F - RTX 3050 6GB ( ALL NEW- Bảo hành 36 Tháng)- 34 slots- 10 HN- 14 HCM', 'PC FASTER GAMING i5 11400F - RTX 3050 6GB ( ALL NEW- Bảo hành 36 Tháng)- 34 slots- 10 HN- 14 HCM', 'PC FASTER GAMING i5 11400F - RTX 3050 6GB ( ALL NEW- Bảo hành 36 Tháng)- 34 slots- 10 HN- 14 HCM', 'PC FASTER GAMING i5 11400F - RTX 3050 6GB ( ALL NEW- Bảo hành 36 Tháng)- 34 slots- 10 HN- 14 HCM', 0, '2025-09-04 07:18:46', '2025-09-04 07:18:46', 'GALLERYPRODUCT_DETAILS-1756945125997.jpg'),
(16, 1, 9, 4, 'Chuột Logitech G Pro X Superlight 2 DEX Wireless Black', 'chuột-logitech-g-pro-x-superlight-2-dex-wireless-black', '1', 'Máy', 'Chuột Logitech G Pro X Superlight 2 DEX Wireless Black', 'Chuột Logitech G Pro X Superlight 2 DEX Wireless Black', 'Chuột Logitech G Pro X Superlight 2 DEX Wireless Black', 'Chuột Logitech G Pro X Superlight 2 DEX Wireless Black', 0, '2025-09-04 07:26:02', '2025-09-04 07:26:02', 'GALLERYPRODUCT_DETAILS-1756945561995.jpg'),
(17, 1, 12, 3, 'Màn Hình Gaming SAMSUNG Odyssey G5 G55C LS32CG552EEXXV (32.0 inch - 2K - VA - 165Hz - 1ms - FreeSync - HDR10 - Curved)', 'màn-hình-gaming-samsung-odyssey-g5-g55c-ls32cg552eexxv-(32.0-inch---2k---va---165hz---1ms---freesync---hdr10---curved)', '1', 'Máy ', 'Màn Hình Gaming SAMSUNG Odyssey G5 G55C LS32CG552EEXXV (32.0 inch - 2K - VA - 165Hz - 1ms - FreeSync - HDR10 - Curved)', 'Màn Hình Gaming SAMSUNG Odyssey G5 G55C LS32CG552EEXXV (32.0 inch - 2K - VA - 165Hz - 1ms - FreeSync - HDR10 - Curved)', 'Màn Hình Gaming SAMSUNG Odyssey G5 G55C LS32CG552EEXXV (32.0 inch - 2K - VA - 165Hz - 1ms - FreeSync - HDR10 - Curved)', 'Màn Hình Gaming SAMSUNG Odyssey G5 G55C LS32CG552EEXXV (32.0 inch - 2K - VA - 165Hz - 1ms - FreeSync - HDR10 - Curved)', 0, '2025-09-04 07:27:45', '2025-09-04 07:27:45', 'GALLERYPRODUCT_DETAILS-1756945665204.jpg'),
(18, 1, 12, 1, 'Màn hình gaming Asus TUF Gaming VG27AQM5A (27 inch / QHD / IPS / 300Hz / 0.3ms)', 'màn-hình-gaming-asus-tuf-gaming-vg27aqm5a-(27-inch-/-qhd-/-ips-/-300hz-/-0.3ms)', '1', 'Máy', 'Màn hình gaming Asus TUF Gaming VG27AQM5A (27 inch / QHD / IPS / 300Hz / 0.3ms)', 'Màn hình gaming Asus TUF Gaming VG27AQM5A (27 inch / QHD / IPS / 300Hz / 0.3ms)', 'Màn hình gaming Asus TUF Gaming VG27AQM5A (27 inch / QHD / IPS / 300Hz / 0.3ms)', 'Màn hình gaming Asus TUF Gaming VG27AQM5A (27 inch / QHD / IPS / 300Hz / 0.3ms)', 0, '2025-09-04 07:29:11', '2025-09-04 07:29:11', 'GALLERYPRODUCT_DETAILS-1756945751758.jpg'),
(19, 1, 17, 8, 'CPU Intel Core i5 14400F - TRAY (Up To 4.70GHz, 10 Nhân 16 Luồng, 20MB Cache, LGA 1700)', 'cpu-intel-core-i5-14400f---tray-(up-to-4.70ghz,-10-nhân-16-luồng,-20mb-cache,-lga-1700)', '1', 'Chip', 'CPU Intel Core i5 14400F - TRAY (Up To 4.70GHz, 10 Nhân 16 Luồng, 20MB Cache, LGA 1700)', 'CPU Intel Core i5 14400F - TRAY (Up To 4.70GHz, 10 Nhân 16 Luồng, 20MB Cache, LGA 1700)', 'Linh kiện máy tính', 'CPU Intel Core i5 14400F - TRAY (Up To 4.70GHz, 10 Nhân 16 Luồng, 20MB Cache, LGA 1700)', 0, '2025-09-04 08:04:08', '2025-09-04 09:20:03', 'GALLERYPRODUCT_DETAILS-1756947848376.png'),
(20, 1, 2, 9, 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO RYZEN 9 9950X- RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 'pc-ttg-designer--3d-render---edit-video-ryzen-9-9950x--rtx-5060-8gb-(all-new---bảo-hành-36-tháng)', '1', 'Máy', 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO RYZEN 9 9950X- RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO RYZEN 9 9950X- RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO RYZEN 9 9950X- RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO RYZEN 9 9950X- RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 0, '2025-09-04 09:26:02', '2025-09-04 09:26:02', 'GALLERYPRODUCT_DETAILS-1756952762529.jpg'),
(21, 1, 2, 8, 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO i5 14600KF - RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 'pc-ttg-designer--3d-render---edit-video-i5-14600kf---rtx-5060-8gb-(all-new---bảo-hành-36-tháng)', '1', 'Máy', 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO i5 14600KF - RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO i5 14600KF - RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO i5 14600KF - RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO i5 14600KF - RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 0, '2025-09-04 09:28:23', '2025-09-04 09:28:23', 'GALLERYPRODUCT_DETAILS-1756952903408.jpg'),
(22, 1, 2, 8, 'PC WORKSTATION - GAMING PROFESSIONAL RTX 4070 Ti SUPER 16GB OC - I7 14700K ( ALL NEW - Bảo Hành 36 Tháng)', 'pc-workstation---gaming-professional-rtx-4070-ti-super-16gb-oc---i7-14700k-(-all-new---bảo-hành-36-tháng)', '1', 'Máy', 'PC WORKSTATION - GAMING PROFESSIONAL RTX 4070 Ti SUPER 16GB OC - I7 14700K ( ALL NEW - Bảo Hành 36 Tháng)', 'PC WORKSTATION - GAMING PROFESSIONAL RTX 4070 Ti SUPER 16GB OC - I7 14700K ( ALL NEW - Bảo Hành 36 Tháng)', 'PC WORKSTATION - GAMING PROFESSIONAL RTX 4070 Ti SUPER 16GB OC - I7 14700K ( ALL NEW - Bảo Hành 36 Tháng)', 'PC WORKSTATION - GAMING PROFESSIONAL RTX 4070 Ti SUPER 16GB OC - I7 14700K ( ALL NEW - Bảo Hành 36 Tháng)', 0, '2025-09-04 09:30:20', '2025-09-04 09:30:20', 'GALLERYPRODUCT_DETAILS-1756953020710.jpg'),
(23, 1, 17, 9, 'Card màn hình OCPC AMD Radeon RX 6600 LE 8GB XR', 'card-màn-hình-ocpc-amd-radeon-rx-6600-le-8gb-xr', '1', 'Card', 'Card màn hình OCPC AMD Radeon RX 6600 LE 8GB XR', 'Card màn hình OCPC AMD Radeon RX 6600 LE 8GB XR', 'Card màn hình OCPC AMD Radeon RX 6600 LE 8GB XR', 'Card màn hình OCPC AMD Radeon RX 6600 LE 8GB XR', 0, '2025-09-04 09:35:21', '2025-09-04 09:35:21', 'GALLERYPRODUCT_DETAILS-1756953321449.png'),
(24, 1, 17, 1, 'Card màn hình ASUS ROG ASTRAL RTX 5090 32GB GAMING WHITE OC', 'card-màn-hình-asus-rog-astral-rtx-5090-32gb-gaming-white-oc', '1', 'Card ', 'Card màn hình ASUS ROG ASTRAL RTX 5090 32GB GAMING WHITE OC', 'Card màn hình ASUS ROG ASTRAL RTX 5090 32GB GAMING WHITE OC', 'Card màn hình ASUS ROG ASTRAL RTX 5090 32GB GAMING WHITE OC', 'Card màn hình ASUS ROG ASTRAL RTX 5090 32GB GAMING WHITE OC', 0, '2025-09-04 09:37:19', '2025-09-04 09:37:19', 'GALLERYPRODUCT_DETAILS-1756953439746.jpg'),
(26, 1, 17, 8, 'Card màn hình PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6', 'card-màn-hình-powercolor-reaper-amd-radeon-rx-9060-xt-16gb-gddr6', '1', 'Máy', 'Card màn hình PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6', 'Card màn hình PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6', 'Card màn hình PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6', 'Card màn hình PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6', 0, '2025-09-04 09:39:23', '2025-09-04 09:39:23', 'GALLERYPRODUCT_DETAILS-1756953563337.jpg'),
(28, 1, 17, 8, 'Card màn hình Gigabyte GeForce RTX 3050 WINDFORCE OC V2 8GB (N3050WF2OCV2-8GD)', 'card-màn-hình-gigabyte-geforce-rtx-3050-windforce-oc-v2-8gb-(n3050wf2ocv2-8gd)', '1', 'Card', 'Card màn hình Gigabyte GeForce RTX 3050 WINDFORCE OC V2 8GB (N3050WF2OCV2-8GD)', 'Card màn hình Gigabyte GeForce RTX 3050 WINDFORCE OC V2 8GB (N3050WF2OCV2-8GD)', 'Card màn hình Gigabyte GeForce RTX 3050 WINDFORCE OC V2 8GB (N3050WF2OCV2-8GD)', 'Card màn hình Gigabyte GeForce RTX 3050 WINDFORCE OC V2 8GB (N3050WF2OCV2-8GD)', 0, '2025-09-04 09:40:57', '2025-09-04 09:40:57', 'GALLERYPRODUCT_DETAILS-1756953657642.jpg'),
(29, 1, 12, 2, 'Màn Hình Dell P2425H (23.8 inch - FHD - IPS - 100Hz - 5ms - USB TypeC)', 'màn-hình-dell-p2425h-(23.8-inch---fhd---ips---100hz---5ms---usb-typec)', '1', 'Máy', 'Màn Hình Dell P2425H (23.8 inch - FHD - IPS - 100Hz - 5ms - USB TypeC)', 'Màn Hình Dell P2425H (23.8 inch - FHD - IPS - 100Hz - 5ms - USB TypeC)', 'Màn hình máy tính các loại', 'Màn Hình Dell P2425H (23.8 inch - FHD - IPS - 100Hz - 5ms - USB TypeC)', 0, '2025-09-04 09:42:40', '2025-09-04 09:47:57', 'GALLERYPRODUCT_DETAILS-1756953760195.jpg'),
(30, 1, 12, 8, 'Màn hình AOC 24B36X (23.8 inch/FHD/IPS/144Hz/0.5ms)', 'màn-hình-aoc-24b36x-(23.8-inch/fhd/ips/144hz/0.5ms)', '1', 'Máy', 'Màn hình AOC 24B36X (23.8 inch/FHD/IPS/144Hz/0.5ms)', 'Màn hình AOC 24B36X (23.8 inch/FHD/IPS/144Hz/0.5ms)', 'Màn hình AOC 24B36X (23.8 inch/FHD/IPS/144Hz/0.5ms)', 'Màn hình AOC 24B36X (23.8 inch/FHD/IPS/144Hz/0.5ms)', 0, '2025-09-04 09:50:05', '2025-09-04 09:50:05', 'GALLERYPRODUCT_DETAILS-1756954205460.jpg'),
(31, 1, 1, 6, 'Laptop Acer Aspire 16 AI A16 71M 71U7 - NX.J4YSV.002 (Ultra 7 155H, 16GB, 512GB, Full HD+, Win11)', 'laptop-acer-aspire-16-ai-a16-71m-71u7---nx.j4ysv.002-(ultra-7-155h,-16gb,-512gb,-full-hd+,-win11)', '1', 'Máy', 'Laptop Acer Aspire 16 AI A16 71M 71U7 - NX.J4YSV.002 (Ultra 7 155H, 16GB, 512GB, Full HD+, Win11)', 'Laptop Acer Aspire 16 AI A16 71M 71U7 - NX.J4YSV.002 (Ultra 7 155H, 16GB, 512GB, Full HD+, Win11)', 'Laptop Acer Aspire 16 AI A16 71M 71U7 - NX.J4YSV.002 (Ultra 7 155H, 16GB, 512GB, Full HD+, Win11)', 'Laptop Acer Aspire 16 AI A16 71M 71U7 - NX.J4YSV.002 (Ultra 7 155H, 16GB, 512GB, Full HD+, Win11)', 0, '2025-09-04 09:56:02', '2025-09-04 09:56:02', 'GALLERYPRODUCT_DETAILS-1756954562057.jpg'),
(32, 1, 11, 8, 'Tai nghe Bluetooth Chụp Tai Sony WH-CH520', 'tai-nghe-bluetooth-chụp-tai-sony-wh-ch520', '1', 'Máy', 'Tai nghe Bluetooth Chụp Tai Sony WH-CH520', 'Tai nghe Bluetooth Chụp Tai Sony WH-CH520', 'Tai nghe Bluetooth Chụp Tai Sony WH-CH520', 'Tai nghe Bluetooth Chụp Tai Sony WH-CH520', 0, '2025-09-04 10:02:35', '2025-09-04 10:02:35', 'GALLERYPRODUCT_DETAILS-1756954955379.jpg'),
(33, 1, 11, 8, 'Tai nghe Bluetooth Chụp Tai Sony WH-CH720N', 'tai-nghe-bluetooth-chụp-tai-sony-wh-ch720n', '1', 'Máy', 'Tai nghe Bluetooth Chụp Tai Sony WH-CH720N', 'Tai nghe Bluetooth Chụp Tai Sony WH-CH720N', 'Tai nghe Bluetooth Chụp Tai Sony WH-CH720N', 'Tai nghe Bluetooth Chụp Tai Sony WH-CH720N', 0, '2025-09-04 12:59:21', '2025-09-04 12:59:21', 'GALLERYPRODUCT_DETAILS-1756965561477.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_details`
--

CREATE TABLE `product_details` (
  `ID_PRODUCTDETAILS` int(11) NOT NULL,
  `ID_PRODUCT` int(11) NOT NULL,
  `NAME_PRODUCTDETAILS` varchar(255) DEFAULT NULL,
  `PRICE_PRODUCTDETAILS` float DEFAULT NULL,
  `SALE_PRODUCTDETAILS` float DEFAULT NULL,
  `RATING_PRODUCTDETAILS` float DEFAULT NULL,
  `ISSHOW_PRODUCTDETAILS` tinyint(1) DEFAULT NULL,
  `AMOUNT_AVAILABLE` int(11) DEFAULT NULL,
  `SPECIFICATION` text DEFAULT NULL,
  `Import_Price` float DEFAULT NULL,
  `GALLERYPRODUCT_DETAILS` text NOT NULL,
  `USERUPDATE` varchar(255) DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_details`
--

INSERT INTO `product_details` (`ID_PRODUCTDETAILS`, `ID_PRODUCT`, `NAME_PRODUCTDETAILS`, `PRICE_PRODUCTDETAILS`, `SALE_PRODUCTDETAILS`, `RATING_PRODUCTDETAILS`, `ISSHOW_PRODUCTDETAILS`, `AMOUNT_AVAILABLE`, `SPECIFICATION`, `Import_Price`, `GALLERYPRODUCT_DETAILS`, `USERUPDATE`, `CREATEAT`, `UPDATEAT`, `ISDELETE`) VALUES
(6, 8, 'PC 4K GAMING RTX 4070 12400F (ALL NEW - BH 36 tháng) - 4 Slots order - 2 Hà Nội -2 HCM', 21790000, 0, 0, 1, 12, 'Mainboard: ASUS TUF GAMING B660M PLUS DDR4 - Hỗ trợ CPU Intel thế hệ 12, chipset B660, khe cắm RAM DDR4, PCIe 4.0, M.2 NVMe, Wi-Fi 6, Bluetooth 5.2. CPU: Intel Core i9-12900K (16 nhân 24 luồng, 3.9GHz - 5.2GHz) - Hiệu năng mạnh. RAM: 32GB DDR4 3600MHz - Đa nhiệm mượt mà. SSD: 512GB M.2 PCIe Gen4 - Khởi động nhanh. VGA: ASUS Dual Radeon RX 6600 8GB - Đồ họa mạnh. Nguồn: 750W 80 Plus Bronze. Case: Golden Field N95FA - 3 Fan ARGB.', 20000000, 'GALLERYPRODUCT_DETAILS-1756953108708.jpg', 'admin', '2025-06-15 17:32:22', '2025-09-04 10:08:50', 0),
(7, 9, 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 14990000, 0, 0, 1, 13, 'Công nghệ CPU:Intel Core i5 Raptor Lake - 13420H\r\nSố nhân:8\r\nSố luồng:12\r\nTốc độ CPU:2.1GHz\r\nTốc độ tối đa:Turbo Boost 4.6 GHz', 14000000, 'GALLERYPRODUCT_DETAILS-1749983772252.jpg', 'admin', '2025-06-15 17:36:12', '2025-06-15 17:36:12', 0),
(8, 10, 'Chuột Zadez Gaming có dây G-156M', 209000, 0, 0, 1, 145, 'Chuột Zadez Gaming có dây G-156M', 109000, 'GALLERYPRODUCT_DETAILS-1749983875619.webp', 'admin', '2025-06-15 17:37:55', '2025-06-15 17:37:55', 0),
(9, 11, 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 730000, 0, 0, 1, 11, 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 530000, 'GALLERYPRODUCT_DETAILS-1749983971161.webp', 'admin', '2025-06-15 17:39:31', '2025-06-15 17:39:31', 0),
(10, 12, 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 17899000, 0, 0, 1, 3, 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 15000000, 'GALLERYPRODUCT_DETAILS-1749984051539.jpg', 'admin', '2025-06-15 17:40:51', '2025-06-15 17:40:51', 0),
(12, 14, 'Laptop Lenovo LOQ 15IAX9E 83LK0079VN', 19800900, 0, 0, 1, 3, 'Laptop Lenovo LOQ 15IAX9E 83LK0079VN là dòng laptop gaming có hiệu năng mạnh mẽ với chip Intel Core i5-12450HX với 8 nhân 12 luồng, xung nhịp tối đa 4.4GHz. Laptop tích hợp card rời NVIDIA GeForce RTX 3050 6GB GDDR6 để tối ưu khả năng đồ họa. Máy sở hữu 16GB RAM DDR5-4800 và ổ cứng SSD 512GB PCIe 4.0x4 NVMe hỗ trợ nâng lên 1TB.', 19000000, 'GALLERYPRODUCT_DETAILS-1756944640279.webp', 'admin', '2025-09-04 07:10:40', '2025-09-04 07:10:40', 0),
(13, 15, 'PC FASTER GAMING i5 11400F - RTX 3050 6GB ( ALL NEW- Bảo hành 36 Tháng)- 34 slots- 10 HN- 14 HCM', 9990000, 0, 0, 1, 5, 'CPU Intel Core i5-11400F (6 Nhân 12 Luồng | Up To 4.4GHz | 12M Cache | 65W) (TRAY NEW ). Mainboard ASROCK H510M-H2/M.2 SE. RAM OCPC XT II 16GB BUS 3200 DDR4 BLACK. Ổ cứng SSD TeamGroup CX2 256GB 2.5 inch SATA III. NGUỒN MÁY TÍNH AIGO VK550 - 550W (80 PLUS/ ACTIVE PFC/ SINGLE RAIL). CARD MÀN HÌNH ZOTAC GAMING GeForce RTX 3050 Twin Edge OC. Vỏ Case XIGMATEK ALPHARD M LACK. TẢN NHIỆT KHÍ JONSBO CR-1200.', 9000000, 'GALLERYPRODUCT_DETAILS-1756945125997.jpg', 'admin', '2025-09-04 07:18:46', '2025-09-04 07:18:46', 0),
(14, 16, 'Chuột Logitech G Pro X Superlight 2 DEX Wireless Black', 3390000, 0, 0, 1, 23, 'Chuột Logitech G Pro X Superlight 2 DEX Wireless Black\r\nChuột gaming không dây công thái học nhẹ nhất thế giới, chỉ 60 gram\r\nCảm biến HERO 2 thế hệ mới với DPI lên tới 32.000\r\nGia tốc tối đa: >40G\r\nTốc độ tối đa: >500IPS\r\nĐầu nhận tín hiệu LightSpeed mới nhất với tần số giao tiếp lên tới 8000Hz. \r\nNút bấm LightForce Hybrid mới nhất. \r\nFeet PTFE siêu bền bỉ, ma sát thấp. \r\nThời lượng pin lên tới 95 giờ. ', 3000000, 'GALLERYPRODUCT_DETAILS-1756945561995.jpg', 'admin', '2025-09-04 07:26:02', '2025-09-04 07:26:02', 0),
(15, 17, 'Màn Hình Gaming SAMSUNG Odyssey G5 G55C LS32CG552EEXXV (32.0 inch - 2K - VA - 165Hz - 1ms - FreeSync - HDR10 - Curved)', 5649000, 0, 0, 1, 12, 'Màn Hình cong Samsung \r\nKích Thước: 32 Inch\r\nĐộ Phân Giải: 2560 x 1440. \r\nTần Số Quét: 165Hz. \r\nĐộ Rộng Dải Màu: 72% NTSC. \r\nBảo hành: 24 tháng. ', 5000000, 'GALLERYPRODUCT_DETAILS-1756945665204.jpg', 'admin', '2025-09-04 07:27:45', '2025-09-04 07:27:45', 0),
(16, 18, 'Màn hình gaming Asus TUF Gaming VG27AQM5A (27 inch / QHD / IPS / 300Hz / 0.3ms)', 7280000, 0, 0, 1, 5, ' Kích thước màn hình: 27 inch, tỉ lệ 16:9.\r\n Độ phân giải: 2560x1440, tần số quét tối đa 300Hz.\r\n Thời gian phản hồi: 0.3ms (GTG).\r\nĐộ sáng: 300cd/㎡, độ tương phản 1300:1. \r\nGam màu sRGB: 130%, 16.7 triệu màu. \r\nCổng kết nối: DP 1.4, HDMI 2.1, USB-C. \r\nBảo hành: 36 Tháng. ', 7000000, 'GALLERYPRODUCT_DETAILS-1756945751758.jpg', 'admin', '2025-09-04 07:29:11', '2025-09-04 07:29:11', 0),
(17, 19, 'CPU Intel Core i5 14400F - TRAY (Up To 4.70GHz, 10 Nhân 16 Luồng, 20MB Cache, LGA 1700)', 36920, 0, 0, 1, 2, 'CPU: Intel Core i5-14400F \r\nSocket: LGA1700 \r\nSố nhân/luồng: 10(6P-Core|4E-Core)/16 luồng. \r\nBase Clock (P-Core): 2.5 GHz. \r\nBoost Clock (P-Core): 4.7 GHz. \r\nTDP: 65W. ', 3000000, 'GALLERYPRODUCT_DETAILS-1756947848376.png', 'admin', '2025-09-04 08:04:08', '2025-09-04 09:20:03', 0),
(18, 20, 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO RYZEN 9 9950X- RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 39600100, 0, 0, 1, 3, 'CPU AMD Ryzen 9 9950X (16 nhân 32 luồng, lên đến 5,7 GHz, Bộ nhớ đệm 80MB) - TRAY. \r\nBo mạch chủ ASUS PRIME X870-P WIFI-CSM. \r\nRAM GEIL SPEAR V 32GB (2x16GB) BUSS 5200MHZ DDR5 ĐEN. \r\nỔ CỨNG SSD PNY CS1031 500GB M.2 2280 PCIE NVME. \r\nNguồn Gigabyte P750BS 750W Plus Bronze (GP-P750BS). \r\nCard màn hình Palit GeForce RTX 5060 Dual 8GB GDDR7. \r\nVỏ Case XIGMATEK CUBI II ĐEN - KÈM 4 FAN ARGB BLACK. \r\nTản nhiệt khí CoolerMaster T620S BLACK ARGB. ', 35000000, 'GALLERYPRODUCT_DETAILS-1756952762529.jpg', 'admin', '2025-09-04 09:26:02', '2025-09-04 09:26:02', 0),
(19, 21, 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO i5 14600KF - RTX 5060 8GB (All NEW - Bảo hành 36 tháng)', 24900100, 0, 0, 1, 4, 'CPU Intel Core i5-14600KF (Up to 5.3GHz, 14 NHÂN 20 LUỒNG, 24MB CACHE) TRAY. \r\nBo mạch chủ MSI B760M GAMING WIFI PLUS DDR5. \r\nRAM GEIL SPEAR V 32GB (2x16GB) BUSS 5200MHZ DDR5 ĐEN. \r\nỔ cứng SSD WD GREEN SN3000 500GB M.2 2280 NVMe PCIe Gen 4x4. \r\nNguồn máy tính AIGO GB750 - 750W (80 Plus Bronze/Màu Đen). \r\nCard màn hình Palit GeForce RTX 5060 Dual 8GB GDDR7. \r\nVỏ Case AIGO C218M BLACK - KÈM 4 FAN ARGB. \r\nTản nhiệt khí Thermalright Peerless Assassin 120 ARGB BLACK. ', 20000000, 'GALLERYPRODUCT_DETAILS-1756952903408.jpg', 'admin', '2025-09-04 09:28:23', '2025-09-04 09:28:23', 0),
(20, 22, 'PC WORKSTATION - GAMING PROFESSIONAL RTX 4070 Ti SUPER 16GB OC - I7 14700K ( ALL NEW - Bảo Hành 36 Tháng)', 47600100, 0, 0, 1, 6, 'CPU Intel Core i7 14700K (Turbo up to 5.6GHz / 20 Nhân 28 Luồng / 33MB / LGA 1700)- TRAY. \r\nBo mạch chủ Asus Prime Z790M PLUS CSM DDR5. \r\nRAM GEIL SPEAR V 32GB (2x16GB) BUSS 5200MHZ DDR5 ĐEN. \r\nỔ cứng SSD WD GREEN SN3000 500GB M.2 2280 NVMe PCIe Gen 4x4. \r\nNguồn máy tính Gigabyte P750BS 750W (80 Plus Bronze, GP-P750BS). \r\nCard Màn Hình Colorful GeForce RTX 4070 Ti SUPER NB EX 16GB-V.  Vỏ Case XIGMATEK ANUBIS PRO 4FX. \r\nTản nhiệt nước Thermalright AQUA ELITE V3 360 ARGB BLACK. ', 45000000, 'GALLERYPRODUCT_DETAILS-1756953020710.jpg', 'admin', '2025-09-04 09:30:20', '2025-09-04 09:30:20', 0),
(21, 23, 'Card màn hình OCPC AMD Radeon RX 6600 LE 8GB XR', 5490000, 0, 0, 1, 8, ' Graphic Engine: AMD Radeon RX 6600. \r\n Bộ nhớ: 8GB GDDR6. \r\n Giao diện bộ nhớ: 128-bit. \r\n PSU khuyến nghị: 450W. ', 3000000, 'GALLERYPRODUCT_DETAILS-1756953321449.png', 'admin', '2025-09-04 09:35:21', '2025-09-04 09:35:21', 0),
(22, 24, 'Card màn hình ASUS ROG ASTRAL RTX 5090 32GB GAMING WHITE OC', 99980000, 0, 0, 1, 1, 'Nhân đồ hoạ: NVIDIA® GeForce RTX™ 5090. \r\nDung lượng bộ nhớ: 32Gb GDDR7. \r\nSố nhân CUDA : 21760. \r\nNguồn đề xuất: 1000W. ', 70000000, 'GALLERYPRODUCT_DETAILS-1756953439746.jpg', 'admin', '2025-09-04 09:37:19', '2025-09-04 09:37:19', 0),
(23, 26, 'Card màn hình PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6', 11900800, 0, 0, 1, 4, 'Card màn hình PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6', 10000000, 'GALLERYPRODUCT_DETAILS-1756953563337.jpg', 'admin', '2025-09-04 09:39:23', '2025-09-04 09:39:23', 0),
(24, 28, 'Card màn hình Gigabyte GeForce RTX 3050 WINDFORCE OC V2 8GB (N3050WF2OCV2-8GD)', 5490000, 0, 0, 1, 7, 'Card màn hình Gigabyte GeForce RTX 3050 WINDFORCE OC V2 8GB (N3050WF2OCV2-8GD)', 3000000, 'GALLERYPRODUCT_DETAILS-1756953657642.jpg', 'admin', '2025-09-04 09:40:57', '2025-09-04 09:40:57', 0),
(25, 29, 'Màn Hình Dell P2425H (23.8 inch - FHD - IPS - 100Hz - 5ms - USB TypeC)', 4590000, 0, 0, 1, 9, ' Kiểu dáng màn hình: Phẳng. \r\n Tỉ lệ khung hình: 16:9. \r\n Kích thước mặc định: 23.8 inch. \r\n Công nghệ tấm nền: IPS. \r\n Phân giải điểm ảnh: FHD - 1920 x 1080. \r\n Độ sáng hiển thị: 250 cd/m2 (typical). \r\n Tần số quét màn: 100 Hz (Hertz). \r\n Thời gian đáp ứng: 5ms gray-to-gray (Fast mode), 8ms gray-to-gray (Normal mode). ', 2000000, 'GALLERYPRODUCT_DETAILS-1756953760195.jpg', 'admin', '2025-09-04 09:42:40', '2025-09-04 09:47:57', 0),
(26, 30, 'Màn hình AOC 24B36X (23.8 inch/FHD/IPS/144Hz/0.5ms)', 2300000, 0, 0, 1, 3, 'Màn hình AOC 24B36X (23.8 inch/FHD/IPS/144Hz/0.5ms)', 1500000, 'GALLERYPRODUCT_DETAILS-1756954205460.jpg', 'admin', '2025-09-04 09:50:05', '2025-09-04 09:50:05', 0),
(27, 31, 'Laptop Acer Aspire 16 AI A16 71M 71U7 - NX.J4YSV.002 (Ultra 7 155H, 16GB, 512GB, Full HD+, Win11)', 19690000, 0, 0, 1, 5, 'Laptop Acer Aspire 16 AI A16 71M 71U7 - NX.J4YSV.002 (Ultra 7 155H, 16GB, 512GB, Full HD+, Win11)', 18000000, 'GALLERYPRODUCT_DETAILS-1756954562057.jpg', 'admin', '2025-09-04 09:56:02', '2025-09-04 09:56:02', 0),
(28, 32, 'Tai nghe Bluetooth Chụp Tai Sony WH-CH520', 1060000, 0, 0, 1, 3, 'Tai nghe Bluetooth Chụp Tai Sony WH-CH520', 1000000, 'GALLERYPRODUCT_DETAILS-1756954955379.jpg', 'admin', '2025-09-04 10:02:35', '2025-09-04 10:02:35', 0),
(29, 33, 'Tai nghe Bluetooth Chụp Tai Sony WH-CH720N', 2750000, 0, 0, 1, 5, 'Tai nghe Bluetooth Chụp Tai Sony WH-CH720N', 2300000, 'GALLERYPRODUCT_DETAILS-1756965561477.jpg', 'admin', '2025-09-04 12:59:21', '2025-09-04 12:59:21', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotion`
--

CREATE TABLE `promotion` (
  `ID_PROMOTION` int(11) NOT NULL,
  `NAME_PROMOTION` varchar(255) DEFAULT NULL,
  `DISCOUNTRATE_PROMOTION` float DEFAULT NULL,
  `DESCRIPTION` text DEFAULT NULL,
  `STRARDATE` datetime DEFAULT NULL,
  `ENDDATE` datetime DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `promotion`
--

INSERT INTO `promotion` (`ID_PROMOTION`, `NAME_PROMOTION`, `DISCOUNTRATE_PROMOTION`, `DESCRIPTION`, `STRARDATE`, `ENDDATE`, `CREATEAT`, `UPDATEAT`, `ISDELETE`) VALUES
(1, 'Không khuyến mãi', 0, 'Sản phẩm không áp dụng chương trình khuyến mãi', NULL, NULL, '2025-06-09 14:24:56', '2025-06-09 14:24:56', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role`
--

CREATE TABLE `role` (
  `ID_ROLE` int(11) NOT NULL,
  `RANK_ROLE` varchar(255) DEFAULT NULL,
  `NAME_ROLE` varchar(255) DEFAULT NULL,
  `DESCRIBES` text DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `role`
--

INSERT INTO `role` (`ID_ROLE`, `RANK_ROLE`, `NAME_ROLE`, `DESCRIBES`, `CREATEAT`, `UPDATEAT`, `ISDELETE`) VALUES
(1, '0', 'Admin', 'Quản trị hệ thống', '2025-04-26 20:14:20', NULL, 0),
(2, '1', 'User', 'Người dùng', '2025-06-07 20:54:42', NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `ID_USER` int(11) NOT NULL,
  `ID_ROLE` int(11) NOT NULL,
  `EMAIL` varchar(255) DEFAULT NULL,
  `FIRSTNAME` varchar(255) DEFAULT NULL,
  `LASTNAME` varchar(255) DEFAULT NULL,
  `PHONENUMBER` varchar(15) DEFAULT NULL,
  `CODEADDRESS` varchar(255) DEFAULT NULL,
  `ADDRESS` varchar(255) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`ID_USER`, `ID_ROLE`, `EMAIL`, `FIRSTNAME`, `LASTNAME`, `PHONENUMBER`, `CODEADDRESS`, `ADDRESS`, `PASSWORD`, `CREATEAT`, `UPDATEAT`, `ISDELETE`) VALUES
(4, 1, 'baoquoczero@gmail.com', 'Đây là', 'Admin', '0372701722', '0', 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '$2b$10$jZNORFdr.T70VDFOVtETqexA2lRh3v1xHrfto1p4O/W7yDSdon7M.', NULL, '2025-08-12 05:49:05', 0),
(5, 2, 'baoquocone@gmail.com', 'Nguyễn', 'Bảo', '0372701722', '0', 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', NULL, '2025-06-07 13:54:42', NULL, 0);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`ID_BRAND`);

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`ID_CART`),
  ADD KEY `FK_CART_USER` (`ID_USER`);

--
-- Chỉ mục cho bảng `cart_item`
--
ALTER TABLE `cart_item`
  ADD PRIMARY KEY (`ID_CARTITEMS`),
  ADD KEY `FK_CARTITEMS_PRODUCT` (`ID_PRODUCTDETAILS`),
  ADD KEY `FK_CART_CARTITEMS` (`ID_CART`);

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`ID_CATEGORY`);

--
-- Chỉ mục cho bảng `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`ID_COMMENT`),
  ADD KEY `FK_COMMENT_PRODUCTDETAILS` (`ID_PRODUCTDETAILS`),
  ADD KEY `FK_COMMENT_USER` (`ID_USER`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`ID_ORDER`),
  ADD KEY `FK_ORDER_USER` (`ID_USER`);

--
-- Chỉ mục cho bảng `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`ID_ORDERITEM`),
  ADD KEY `FK_ORDERITEM_PRODUCTDETAILS` (`ID_PRODUCTDETAILS`),
  ADD KEY `FK_ORDER_ORDERITEM` (`ID_ORDER`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`ID_PRODUCT`),
  ADD KEY `FK_BRAND_PRODUCT` (`ID_BRAND`),
  ADD KEY `FK_CATEGORY_PRODUCT` (`ID_CATEGORY`),
  ADD KEY `FK_PRODUCT_PROMOTION` (`ID_PROMOTION`);

--
-- Chỉ mục cho bảng `product_details`
--
ALTER TABLE `product_details`
  ADD PRIMARY KEY (`ID_PRODUCTDETAILS`),
  ADD KEY `FK_PRODUCT_PRODUCTDETAILS` (`ID_PRODUCT`);

--
-- Chỉ mục cho bảng `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`ID_PROMOTION`);

--
-- Chỉ mục cho bảng `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`ID_ROLE`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID_USER`),
  ADD KEY `FK_ROLE_USER` (`ID_ROLE`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `brand`
--
ALTER TABLE `brand`
  MODIFY `ID_BRAND` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `ID_CART` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `cart_item`
--
ALTER TABLE `cart_item`
  MODIFY `ID_CARTITEMS` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `ID_CATEGORY` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `comment`
--
ALTER TABLE `comment`
  MODIFY `ID_COMMENT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `ID_ORDER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT cho bảng `order_item`
--
ALTER TABLE `order_item`
  MODIFY `ID_ORDERITEM` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `ID_PRODUCT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `product_details`
--
ALTER TABLE `product_details`
  MODIFY `ID_PRODUCTDETAILS` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `promotion`
--
ALTER TABLE `promotion`
  MODIFY `ID_PROMOTION` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `role`
--
ALTER TABLE `role`
  MODIFY `ID_ROLE` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `ID_USER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `FK_CART_USER` FOREIGN KEY (`ID_USER`) REFERENCES `user` (`ID_USER`);

--
-- Các ràng buộc cho bảng `cart_item`
--
ALTER TABLE `cart_item`
  ADD CONSTRAINT `FK_CARTITEMS_PRODUCT` FOREIGN KEY (`ID_PRODUCTDETAILS`) REFERENCES `product_details` (`ID_PRODUCTDETAILS`),
  ADD CONSTRAINT `FK_CART_CARTITEMS` FOREIGN KEY (`ID_CART`) REFERENCES `cart` (`ID_CART`);

--
-- Các ràng buộc cho bảng `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FK_COMMENT_PRODUCTDETAILS` FOREIGN KEY (`ID_PRODUCTDETAILS`) REFERENCES `product_details` (`ID_PRODUCTDETAILS`),
  ADD CONSTRAINT `FK_COMMENT_USER` FOREIGN KEY (`ID_USER`) REFERENCES `user` (`ID_USER`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_ORDER_USER` FOREIGN KEY (`ID_USER`) REFERENCES `user` (`ID_USER`);

--
-- Các ràng buộc cho bảng `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `FK_ORDERITEM_PRODUCTDETAILS` FOREIGN KEY (`ID_PRODUCTDETAILS`) REFERENCES `product_details` (`ID_PRODUCTDETAILS`),
  ADD CONSTRAINT `FK_ORDER_ORDERITEM` FOREIGN KEY (`ID_ORDER`) REFERENCES `orders` (`ID_ORDER`);

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK_BRAND_PRODUCT` FOREIGN KEY (`ID_BRAND`) REFERENCES `brand` (`ID_BRAND`),
  ADD CONSTRAINT `FK_CATEGORY_PRODUCT` FOREIGN KEY (`ID_CATEGORY`) REFERENCES `category` (`ID_CATEGORY`),
  ADD CONSTRAINT `FK_PRODUCT_PROMOTION` FOREIGN KEY (`ID_PROMOTION`) REFERENCES `promotion` (`ID_PROMOTION`);

--
-- Các ràng buộc cho bảng `product_details`
--
ALTER TABLE `product_details`
  ADD CONSTRAINT `FK_PRODUCT_PRODUCTDETAILS` FOREIGN KEY (`ID_PRODUCT`) REFERENCES `product` (`ID_PRODUCT`);

--
-- Các ràng buộc cho bảng `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_ROLE_USER` FOREIGN KEY (`ID_ROLE`) REFERENCES `role` (`ID_ROLE`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
