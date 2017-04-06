-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 06, 2017 at 11:18 AM
-- Server version: 5.6.33
-- PHP Version: 7.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `jamjar`
--

-- --------------------------------------------------------

--
-- Table structure for table `orderItem`
--

CREATE TABLE `orderItem` (
  `orderId` int(11) NOT NULL,
  `orderDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `order_product`
--

CREATE TABLE `order_product` (
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `page`
--

CREATE TABLE `page` (
  `pageId` int(11) NOT NULL,
  `pageTitle` varchar(45) DEFAULT NULL,
  `pageDesc` varchar(270) DEFAULT NULL,
  `pageImage1` varchar(45) DEFAULT NULL,
  `pageImage2` varchar(45) DEFAULT NULL,
  `pageImage3` varchar(45) DEFAULT NULL,
  `pageTags` varchar(1024) DEFAULT NULL,
  `pageCreationTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userAdded` int(11) NOT NULL,
  `pageActive` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productId` int(11) NOT NULL,
  `productTitle` varchar(45) DEFAULT NULL,
  `productDesc` varchar(270) DEFAULT NULL,
  `productSize` varchar(30) DEFAULT NULL,
  `prodcuctColor` varchar(45) DEFAULT NULL,
  `productStock` int(5) UNSIGNED DEFAULT NULL,
  `productPrice` decimal(6,0) DEFAULT NULL,
  `productSalePrice` decimal(6,0) DEFAULT NULL,
  `productImage1` varchar(45) DEFAULT NULL,
  `productImage2` varchar(45) DEFAULT NULL,
  `productImage3` varchar(45) DEFAULT NULL,
  `productImage4` varchar(45) DEFAULT NULL,
  `productImage5` varchar(45) DEFAULT NULL,
  `productStatus` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `shipping_info`
--

CREATE TABLE `shipping_info` (
  `shippingId` int(11) NOT NULL,
  `shippingDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `orderId` int(11) NOT NULL,
  `shippingFirstName` varchar(45) NOT NULL,
  `shippingLastName` varchar(45) NOT NULL,
  `shippingrStreet1` varchar(45) NOT NULL,
  `shippingrStreet2` varchar(45) DEFAULT NULL,
  `shippingCity` varchar(45) NOT NULL,
  `shippingCounty` varchar(45) NOT NULL,
  `shippingPostcode` varchar(8) NOT NULL,
  `shippingPhone` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `template`
--

CREATE TABLE `template` (
  `templateId` int(11) NOT NULL,
  `creationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `templateAddr` varchar(20) NOT NULL,
  `userAdded` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `userFirstName` varchar(45) NOT NULL,
  `userLastName` varchar(45) DEFAULT NULL,
  `userStreet1` varchar(45) DEFAULT NULL,
  `userStreet2` varchar(45) DEFAULT NULL,
  `userCity` varchar(45) DEFAULT NULL,
  `userCounty` varchar(45) DEFAULT NULL,
  `userPostcode` varchar(8) DEFAULT NULL,
  `userPhone` varchar(45) DEFAULT NULL,
  `userEmail` varchar(45) DEFAULT NULL,
  `userPassword` varchar(45) DEFAULT NULL,
  `userImage` varchar(100) DEFAULT NULL,
  `userActive` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `userFirstName`, `userLastName`, `userStreet1`, `userStreet2`, `userCity`, `userCounty`, `userPostcode`, `userPhone`, `userEmail`, `userPassword`, `userImage`, `userActive`) VALUES
(1, 'Susan', 'Agnew', '6 Main Street', NULL, 'Clonmel', 'Tipperary', 'E91 D702', '052 123 4567', 'test@test.com', 'password', 'test', 1),
(2, 'Nancy', 'Taylor', '1 King Street', NULL, 'Clonmel', 'Tipperary', 'E91 D702', '052 123 4567', 'test@test.com', 'password', 'test', 1),
(4, 'Ted', 'Smith', '1 Street St', NULL, 'Clonmel', 'Tipperary', 'E91 D702', '052 123 4567', 'test@test.com', 'password', 'test', 1),
(5, 'First5', 'Last5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'password', NULL, NULL),
(6, 'First6', 'Last6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'password', NULL, NULL),
(7, 'First6', 'Last6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'password', NULL, NULL),
(8, 'Blue', 'Skye', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'password', NULL, NULL),
(9, 'Blue', 'Skye', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'password', NULL, NULL),
(10, 'Red', 'Maple', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'password', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orderItem`
--
ALTER TABLE `orderItem`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `fk_order_user` (`userId`);

--
-- Indexes for table `order_product`
--
ALTER TABLE `order_product`
  ADD PRIMARY KEY (`orderId`,`productId`),
  ADD KEY `fk_order_product2` (`productId`);

--
-- Indexes for table `page`
--
ALTER TABLE `page`
  ADD PRIMARY KEY (`pageId`),
  ADD KEY `fk_page_user` (`userAdded`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productId`);

--
-- Indexes for table `shipping_info`
--
ALTER TABLE `shipping_info`
  ADD PRIMARY KEY (`shippingId`,`shippingDate`),
  ADD KEY `fk_shipping_order` (`orderId`);

--
-- Indexes for table `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`templateId`),
  ADD KEY `fk_template_user` (`userAdded`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orderItem`
--
ALTER TABLE `orderItem`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `page`
--
ALTER TABLE `page`
  MODIFY `pageId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `template`
--
ALTER TABLE `template`
  MODIFY `templateId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `orderItem`
--
ALTER TABLE `orderItem`
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`);

--
-- Constraints for table `order_product`
--
ALTER TABLE `order_product`
  ADD CONSTRAINT `fk_order_product1` FOREIGN KEY (`orderId`) REFERENCES `orderItem` (`orderId`),
  ADD CONSTRAINT `fk_order_product2` FOREIGN KEY (`productId`) REFERENCES `product` (`productId`);

--
-- Constraints for table `page`
--
ALTER TABLE `page`
  ADD CONSTRAINT `fk_page_user` FOREIGN KEY (`userAdded`) REFERENCES `user` (`userId`);

--
-- Constraints for table `shipping_info`
--
ALTER TABLE `shipping_info`
  ADD CONSTRAINT `fk_shipping_order` FOREIGN KEY (`orderId`) REFERENCES `orderItem` (`orderId`);

--
-- Constraints for table `template`
--
ALTER TABLE `template`
  ADD CONSTRAINT `fk_template_user` FOREIGN KEY (`userAdded`) REFERENCES `user` (`userId`);
