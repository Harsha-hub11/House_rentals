-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Nov 19, 2024 at 12:46 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `house_id` int NOT NULL,
  `owner_id` int NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `rent_amount` decimal(10,2) NOT NULL,
  `house_type` enum('Apartment','Single-family','Duplex','Townhouse','Other') NOT NULL,
  `bedrooms` int NOT NULL,
  `bathrooms` decimal(3,1) NOT NULL,
  `furnished` tinyint(1) DEFAULT '0',
  `availability_status` enum('Available','Occupied','Under Maintenance') DEFAULT 'Available',
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`house_id`, `owner_id`, `address`, `city`, `state`, `postal_code`, `rent_amount`, `house_type`, `bedrooms`, `bathrooms`, `furnished`, `availability_status`, `description`, `created_at`, `updated_at`) VALUES
(1, 101, '123 Baker Street', 'London', 'Greater London', 'NW1 6XE', 2200.00, 'Apartment', 2, 1.5, 1, 'Available', 'Modern flat near central London', '2024-11-01 10:00:00', '2024-11-01 10:00:00'),
(2, 102, '45 Elmwood Drive', 'Manchester', 'Greater Manchester', 'M15 4RG', 1500.00, 'Single-family', 3, 2.0, 0, 'Occupied', 'Spacious family home with garden', '2024-11-02 10:30:00', '2024-11-02 10:30:00'),
(3, 103, '89 Queen Street', 'Edinburgh', 'Scotland', 'EH2 3NS', 1800.00, 'Townhouse', 4, 3.0, 1, 'Available', 'Stylish townhouse in the city center', '2024-11-03 11:00:00', '2024-11-03 11:00:00'),
(4, 104, '10 Castle Road', 'Bristol', 'South West England', 'BS1 5DQ', 1400.00, 'Duplex', 2, 1.0, 0, 'Available', 'Compact duplex near the waterfront', '2024-11-04 12:00:00', '2024-11-04 12:00:00'),
(5, 105, '32 High Street', 'Oxford', 'Oxfordshire', 'OX1 4AP', 1600.00, 'Apartment', 1, 1.0, 1, 'Under Maintenance', 'Cozy apartment near the university', '2024-11-05 09:00:00', '2024-11-05 09:00:00'),
(6, 106, '7 Park Avenue', 'Cambridge', 'Cambridgeshire', 'CB2 1TT', 2000.00, 'Single-family', 3, 2.0, 1, 'Available', 'Modern home with a large garden', '2024-11-06 14:30:00', '2024-11-06 14:30:00'),
(7, 107, '21 George Square', 'Glasgow', 'Scotland', 'G2 1DU', 1300.00, 'Apartment', 2, 1.0, 0, 'Available', 'Well-maintained flat in the city center', '2024-11-07 15:00:00', '2024-11-07 15:00:00'),
(8, 108, '56 Willow Lane', 'Liverpool', 'Merseyside', 'L1 4AA', 1700.00, 'Townhouse', 3, 2.5, 1, 'Occupied', 'Renovated townhouse with parking', '2024-11-08 16:00:00', '2024-11-08 16:00:00'),
(9, 109, '12 Royal Crescent', 'Bath', 'South West England', 'BA1 2LR', 2500.00, 'Single-family', 5, 3.5, 1, 'Available', 'Luxury home with historical charm', '2024-11-09 17:00:00', '2024-11-09 17:00:00'),
(10, 110, '101 St. Mary Street', 'Cardiff', 'Wales', 'CF10 1DX', 1200.00, 'Apartment', 1, 1.0, 0, 'Available', 'Affordable flat in a central location', '2024-11-10 18:00:00', '2024-11-10 18:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`house_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `house_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
