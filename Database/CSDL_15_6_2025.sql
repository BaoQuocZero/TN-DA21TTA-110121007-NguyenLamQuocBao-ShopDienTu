-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 15, 2025 lúc 04:39 PM
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
(1, 'Laptop', 'laptop', 'Các dòng laptop từ phổ thông đến cao cấp', NULL, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0),
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
(14, 'Ram', 'ram', 'Ram cho laptop và PC', 3, '2025-06-09 14:14:11', '2025-06-09 14:14:11', 0);

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
  `CREATEAT` datetime DEFAULT NULL,
  `UPDATEAT` datetime DEFAULT NULL,
  `ISDELETE` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(8, 1, 2, 1, 'Bộ máy đồ họa Asus TUF- Core i9 12900K - 32GB - 512 SSD - VGA 6600 8GB Dùng Adobe, Autocad, 3dsmax, Render, Gaming', 'bộ-máy-đồ-họa-asus-tuf--core-i9-12900k---32gb---512-ssd---vga-6600-8gb-dùng-adobe,-autocad,-3dsmax,-render,-gaming', '1', 'Máy', 'Bộ máy đồ họa Asus TUF- Core i9 12900K - 32GB - 512 SSD - VGA 6600 8GB Dùng Adobe, Autocad, 3dsmax, Render, Gaming 21,790,0', 'Bộ máy đồ họa Asus TUF- Core i9 12900K - 32GB - 512 SSD - VGA 6600 8GB Dùng Adobe, Autocad, 3dsmax, Render, Gaming', 'Bộ máy đồ họa Asus TUF- Core i9 12900K - 32GB - 512 SSD - VGA 6600 8GB Dùng Adobe, Autocad, 3dsmax, Render, Gaming', 'Bộ máy đồ họa Asus TUF- Core i9 12900K - 32GB - 512 SSD - VGA 6600 8GB Dùng Adobe, Autocad, 3dsmax, Render, Gaming', 1, '2025-06-15 17:32:22', '2025-06-15 17:32:22', 'GALLERYPRODUCT_DETAILS-1749983542513.webp'),
(9, 1, 1, 7, 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 'laptop-lenovo-ideapad-slim-3-15irh10-i5-13420h/16gb/512gb/win11-(83k1000hvn)', '1', 'Máy', 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 1, '2025-06-15 17:36:12', '2025-06-15 17:36:12', 'GALLERYPRODUCT_DETAILS-1749983772252.jpg'),
(10, 1, 9, 4, 'Chuột Zadez Gaming có dây G-156M', 'chuột-zadez-gaming-có-dây-g-156m', '1', 'Máy', 'Chuột Zadez Gaming có dây G-156M', 'Chuột Zadez Gaming có dây G-156M', 'Chuột Zadez Gaming có dây G-156M', 'Chuột Zadez Gaming có dây G-156M', 1, '2025-06-15 17:37:55', '2025-06-15 17:37:55', 'GALLERYPRODUCT_DETAILS-1749983875619.webp'),
(11, 1, 11, 9, 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 'tai-nghe-bluetooth-onikuma-k9-rgb-tai-mèo', '1', 'Máy', 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 1, '2025-06-15 17:39:31', '2025-06-15 17:39:31', 'GALLERYPRODUCT_DETAILS-1749983971161.webp'),
(12, 1, 12, 1, 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 'màn-hình-quảng-cáo-chân-đứng-49-inch-chính-hãng-lux-vision', '1', 'Máy', 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 1, '2025-06-15 17:40:51', '2025-06-15 17:40:51', 'GALLERYPRODUCT_DETAILS-1749984051539.jpg');

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
(6, 8, 'Bộ máy đồ họa Asus TUF- Core i9 12900K - 32GB - 512 SSD - VGA 6600 8GB Dùng Adobe, Autocad, 3dsmax, Render, Gaming', 21790000, 0, 0, 1, 12, 'Mainboard: ASUS TUF GAMING B660M PLUS DDR4 - Hỗ trợ CPU Intel thế hệ 12, chipset B660, khe cắm RAM DDR4, hỗ trợ PCIe 4.0, M.2 NVMe, Wi-Fi 6 và Bluetooth 5.2.\r\nCPU: CPU Intel Core i9 12900K (3.9GHz turbo up to 5.2Ghz, 16 nhân 24 luồng, 30MB Cache, 125W) - Socket Intel LGA 1700/Alder Lake) - Hiệu năng mạnh mẽ với 16 nhân 24 luồng, xung nhịp tối đa lên đến 5.2 GHz, đáp ứng tốt nhu cầu xử lý đa nhiệm nặng.\r\nTản nhiệt: Tản nhiệt nước Thermalright Frozen Horizon 360 Black ARGB – AIO CPU Cooler - Hiệu quả tản nhiệt tốt, giúp CPU hoạt động ổn định và mát mẻ.\r\nRAM: Ram Pioneer Udimm 32GB (16x2) DDR4 3600MHz Tản Nhiệt Thép - Dung lượng RAM lớn 32GB, tốc độ cao 3600MHz, giúp máy chạy đa nhiệm mượt mà, xử lý các tác vụ nặng nhanh chóng.\r\nSSD: SSD Hynix PC801 512GB M2 2280 PCIe Gen 4.0 7000Mb/s - Dung lượng lưu trữ lớn 512GB, tốc độ đọc ghi dữ liệu cao, giúp khởi động máy và truy cập ứng dụng nhanh chóng.\r\nVGA: Card màn hình VGA ASUS Dual Radeon RX 6600 V2 8GB GDDR6 (DUAL-RX6600-8G-V2) - Hiệu năng đồ họa mạnh mẽ, đáp ứng tốt nhu cầu render video, chỉnh sửa ảnh, mô phỏng 3D.\r\nNguồn: Nguồn máy tính Centaur 750W 80 Plus Bronze - Công suất 750W, đạt chứng nhận 80 Plus Bronze, cung cấp năng lượng ổn định cho toàn bộ hệ thống.\r\nCase: Vỏ máy tính Golden Field N95FA - 3 Fan ARGB - Có Remote - Thiết kế hiện đại, sang trọng, hỗ trợ tốt các linh kiện cao cấp.', 20000000, 'GALLERYPRODUCT_DETAILS-1749983542513.webp', 'admin', '2025-06-15 17:32:22', '2025-06-15 17:32:22', 1),
(7, 9, 'Laptop Lenovo IdeaPad Slim 3 15IRH10 i5 13420H/16GB/512GB/Win11 (83K1000HVN)', 14990000, 0, 0, 1, 13, 'Công nghệ CPU:Intel Core i5 Raptor Lake - 13420H\r\nSố nhân:8\r\nSố luồng:12\r\nTốc độ CPU:2.1GHz\r\nTốc độ tối đa:Turbo Boost 4.6 GHz', 14000000, 'GALLERYPRODUCT_DETAILS-1749983772252.jpg', 'admin', '2025-06-15 17:36:12', '2025-06-15 17:36:12', 1),
(8, 10, 'Chuột Zadez Gaming có dây G-156M', 209000, 0, 0, 1, 145, 'Chuột Zadez Gaming có dây G-156M', 109000, 'GALLERYPRODUCT_DETAILS-1749983875619.webp', 'admin', '2025-06-15 17:37:55', '2025-06-15 17:37:55', 1),
(9, 11, 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 730000, 0, 0, 1, 11, 'Tai Nghe Bluetooth Onikuma K9 RGB Tai Mèo', 530000, 'GALLERYPRODUCT_DETAILS-1749983971161.webp', 'admin', '2025-06-15 17:39:31', '2025-06-15 17:39:31', 1),
(10, 12, 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 17899000, 0, 0, 1, 3, 'Màn hình quảng cáo chân đứng 49 inch chính hãng Lux Vision', 15000000, 'GALLERYPRODUCT_DETAILS-1749984051539.jpg', 'admin', '2025-06-15 17:40:51', '2025-06-15 17:40:51', 1);

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
(4, 1, 'baoquoczero@gmail.com', 'Nguyễn', 'Bảo', '0372701722', '0', 'W8JX+46R, Đường D5, Phường 5, Trà Vinh, Việt Nam', '$2b$10$1m7ccgXwL7c5c7Cp8Cf8Hu/fPotcQ.H.qdaXZnDs8FWGfmW9wVBEO', NULL, NULL, 0),
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
  MODIFY `ID_CART` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cart_item`
--
ALTER TABLE `cart_item`
  MODIFY `ID_CARTITEMS` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `ID_CATEGORY` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `comment`
--
ALTER TABLE `comment`
  MODIFY `ID_COMMENT` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `ID_ORDER` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `order_item`
--
ALTER TABLE `order_item`
  MODIFY `ID_ORDERITEM` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `ID_PRODUCT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `product_details`
--
ALTER TABLE `product_details`
  MODIFY `ID_PRODUCTDETAILS` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
  MODIFY `ID_USER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
