-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Apr 15, 2026 at 07:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tuloclicks`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(150) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `booking_reference` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `booking_status` enum('pending','confirmed','cancelled','refunded','checked_in') NOT NULL DEFAULT 'pending',
  `payment_status` enum('unpaid','paid','failed','refunded','partial_refund') NOT NULL DEFAULT 'unpaid',
  `attendee_name` varchar(150) NOT NULL,
  `attendee_email` varchar(150) NOT NULL,
  `attendee_phone` varchar(30) DEFAULT NULL,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `qr_code` varchar(255) DEFAULT NULL,
  `checked_in_at` datetime DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `booked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_reference`, `user_id`, `event_id`, `booking_status`, `payment_status`, `attendee_name`, `attendee_email`, `attendee_phone`, `total_amount`, `qr_code`, `checked_in_at`, `cancellation_reason`, `booked_at`, `updated_at`) VALUES
(1, 'TC-2026-233025', 6, 1, 'checked_in', 'paid', 'RozenCranks Tiuname', 'cranks@gmail.com', '09923123456', 5500.00, NULL, '2026-04-14 01:31:01', NULL, '2026-04-13 16:37:21', '2026-04-13 17:31:01'),
(2, 'TC-2026-206478', 9, 2, 'checked_in', 'paid', 'Marnol Jay Tolo', 'marnoljaytolo@gmail.com', '+63 917 654 3210', 1500.00, NULL, '2026-04-15 12:34:11', NULL, '2026-04-15 02:38:09', '2026-04-15 04:34:11');

-- --------------------------------------------------------

--
-- Table structure for table `booking_items`
--

CREATE TABLE `booking_items` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `ticket_type_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_items`
--

INSERT INTO `booking_items` (`id`, `booking_id`, `ticket_type_id`, `quantity`, `unit_price`, `subtotal`, `created_at`) VALUES
(1, 1, 1, 1, 5500.00, 5500.00, '2026-04-13 16:37:21'),
(2, 2, 2, 1, 1500.00, 1500.00, '2026-04-15 02:38:09');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) DEFAULT NULL,
  `description` text NOT NULL,
  `event_image` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `location_type` enum('physical','online','hybrid') NOT NULL DEFAULT 'physical',
  `custom_location` varchar(255) DEFAULT NULL,
  `online_link` varchar(255) DEFAULT NULL,
  `approval_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `publish_status` enum('draft','published','unpublished','cancelled','completed') NOT NULL DEFAULT 'draft',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `featured_until` datetime DEFAULT NULL,
  `platform_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_revenue` decimal(12,2) NOT NULL DEFAULT 0.00,
  `approval_notes` text DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `rejected_by` int(11) DEFAULT NULL,
  `rejected_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `organizer_id`, `category_id`, `venue_id`, `title`, `slug`, `description`, `event_image`, `start_date`, `end_date`, `start_time`, `end_time`, `location_type`, `custom_location`, `online_link`, `approval_status`, `publish_status`, `featured`, `featured_until`, `platform_fee`, `total_revenue`, `approval_notes`, `approved_by`, `approved_at`, `rejected_by`, `rejected_at`, `created_at`, `updated_at`) VALUES
(1, 2, 2, 1, 'LANY: Soft World Tour', 'lany-soft-world-tour-1776096804926', 'Prepare for a night of dreamy synths, soulful vocals, and the signature California-cool aesthetic that has made LANY a local favorite. Don\'t miss your chance to be part of this \"Soft\" era where every lyric hits home and every melody stays with you.', NULL, '2026-08-06', NULL, '21:30:00', NULL, 'physical', 'Cebu City', NULL, 'approved', 'published', 0, NULL, 0.00, 0.00, 'Approved by admin', 5, '2026-04-14 00:16:33', NULL, NULL, '2026-04-13 16:13:24', '2026-04-13 16:16:33'),
(2, 8, 6, 3, 'Cebu Tech & Startup Summit 2026', 'cebu-tech-startup-summit-2026-1776219853055', 'A premier gathering of tech enthusiasts, startups, and industry leaders in Cebu City. Join us for a full day of insightful talks, networking opportunities, and innovation showcases featuring local and international speakers. Perfect for developers, entrepreneurs, and students looking to grow in the tech industry.', NULL, '2026-07-15', NULL, '09:00:00', NULL, 'physical', 'Cebu City, Philippines ', NULL, 'approved', 'published', 1, NULL, 0.00, 0.00, 'Approved by admin', 5, '2026-04-15 10:25:57', NULL, NULL, '2026-04-15 02:24:13', '2026-04-15 02:26:01');

-- --------------------------------------------------------

--
-- Table structure for table `event_categories`
--

CREATE TABLE `event_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_categories`
--

INSERT INTO `event_categories` (`id`, `name`, `description`, `is_active`, `created_at`) VALUES
(1, 'Conference', 'Professional conferences and summits', 1, '2026-04-13 04:07:53'),
(2, 'Concert', 'Music and live performance events', 1, '2026-04-13 04:07:53'),
(3, 'Workshop', 'Hands-on training and workshop sessions', 1, '2026-04-13 04:07:53'),
(4, 'Seminar', 'Educational seminars and talks', 1, '2026-04-13 04:07:53'),
(5, 'Festival', 'Public festivals and large gatherings', 1, '2026-04-13 04:07:53'),
(6, 'Technology', NULL, 1, '2026-04-15 02:18:13'),
(7, 'Business', NULL, 1, '2026-04-15 02:18:13'),
(8, 'Education', NULL, 1, '2026-04-15 02:18:13'),
(9, 'Health & Wellness', NULL, 1, '2026-04-15 02:18:13'),
(10, 'Sports', NULL, 1, '2026-04-15 02:18:13'),
(11, 'Arts & Culture', NULL, 1, '2026-04-15 02:18:13'),
(12, 'Food & Dining', NULL, 1, '2026-04-15 02:18:13'),
(13, 'Travel & Tourism', NULL, 1, '2026-04-15 02:18:13'),
(14, 'Gaming & Esports', NULL, 1, '2026-04-15 02:18:13'),
(15, 'Fashion', NULL, 1, '2026-04-15 02:18:13'),
(16, 'Music', NULL, 1, '2026-04-15 02:18:13'),
(17, 'Networking', NULL, 1, '2026-04-15 02:18:13'),
(18, 'Startup & Entrepreneurship', NULL, 1, '2026-04-15 02:18:13'),
(19, 'Science', NULL, 1, '2026-04-15 02:18:13'),
(20, 'Environment', NULL, 1, '2026-04-15 02:18:13'),
(21, 'Religious', NULL, 1, '2026-04-15 02:18:13'),
(22, 'Charity & Fundraising', NULL, 1, '2026-04-15 02:18:13'),
(23, 'Family & Kids', NULL, 1, '2026-04-15 02:18:13'),
(24, 'Photography', NULL, 1, '2026-04-15 02:18:13'),
(25, 'Film & Media', NULL, 1, '2026-04-15 02:18:13');

-- --------------------------------------------------------

--
-- Table structure for table `event_speakers`
--

CREATE TABLE `event_speakers` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `speaker_id` int(11) NOT NULL,
  `speaker_order` int(11) NOT NULL DEFAULT 1,
  `topic_title` varchar(200) DEFAULT NULL,
  `topic_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_speakers`
--

INSERT INTO `event_speakers` (`id`, `event_id`, `speaker_id`, `speaker_order`, `topic_title`, `topic_description`, `created_at`) VALUES
(1, 1, 1, 1, NULL, NULL, '2026-04-13 16:14:49'),
(2, 2, 2, 1, NULL, NULL, '2026-04-15 02:29:04');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `related_type` varchar(50) DEFAULT NULL,
  `related_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `related_type`, `related_id`, `created_at`) VALUES
(1, 8, 'Organizer Application Submitted', 'Your organizer application has been submitted and is pending admin review.', 'info', 0, 'organizer_profile', 2, '2026-04-15 02:04:34'),
(2, 8, 'Organizer Application Approved', 'Your organizer application has been approved. You can now create and manage events.', 'success', 0, 'organizer_profile', 2, '2026-04-15 02:06:56'),
(3, 7, 'Organizer Application Submitted', 'Your organizer application has been submitted and is pending admin review.', 'info', 0, 'organizer_profile', 3, '2026-04-15 02:07:30'),
(4, 7, 'Organizer Application Rejected', 'Your organizer application was rejected. Application rejected.', 'error', 0, 'organizer_profile', 3, '2026-04-15 02:07:56'),
(5, 8, 'Event Created', 'Your event \"Cebu Tech & Startup Summit 2026\" has been created as a draft and is waiting for submission.', 'info', 0, 'event', 2, '2026-04-15 02:24:13'),
(6, 8, 'Event Submitted', 'Your event \"Cebu Tech & Startup Summit 2026\" was submitted for admin approval.', 'info', 0, 'event', 2, '2026-04-15 02:25:08'),
(7, 8, 'Event Approved', 'Your event \"Cebu Tech & Startup Summit 2026\" has been approved and published.', 'success', 0, 'event', 2, '2026-04-15 02:25:57'),
(8, 9, 'Booking Created', 'Your booking TC-2026-206478 for \"Cebu Tech & Startup Summit 2026\" was created successfully.', 'success', 0, 'booking', 2, '2026-04-15 02:38:09'),
(9, 9, 'Payment Record Created', 'A payment record was created for your booking TC-2026-206478.', 'info', 0, 'payment', 2, '2026-04-15 02:38:09'),
(10, 9, 'Payment Successful', 'Your payment for booking TC-2026-206478 was marked successful.', 'success', 0, 'payment', 2, '2026-04-15 02:44:50');

-- --------------------------------------------------------

--
-- Table structure for table `organizer_profiles`
--

CREATE TABLE `organizer_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `organization_name` varchar(200) NOT NULL,
  `organization_type` varchar(100) DEFAULT NULL,
  `branding_logo` varchar(255) DEFAULT NULL,
  `branding_banner` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `facebook_link` varchar(255) DEFAULT NULL,
  `instagram_link` varchar(255) DEFAULT NULL,
  `approval_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizer_profiles`
--

INSERT INTO `organizer_profiles` (`id`, `user_id`, `organization_name`, `organization_type`, `branding_logo`, `branding_banner`, `description`, `website`, `facebook_link`, `instagram_link`, `approval_status`, `approved_by`, `approved_at`, `rejection_reason`, `created_at`, `updated_at`) VALUES
(1, 2, 'Lonmar Olot', 'Concert', NULL, NULL, 'Best Organizer', 'https://lonmarolot.com', 'https://facebook.com/lonmarolot', 'https://instagram.com/lonmarolot', 'approved', 5, '2026-04-14 00:16:49', NULL, '2026-04-13 16:06:41', '2026-04-13 16:16:49'),
(2, 8, 'Jane Doe', 'Company', NULL, NULL, 'THE GOAT ', 'https://janedoe-events.com', 'https://facebook.com/janedoe.official', 'https://instagram.com/janedoe.events', 'approved', 5, '2026-04-15 10:06:56', NULL, '2026-04-15 02:04:34', '2026-04-15 02:06:56'),
(3, 7, 'Ericksoyn Tiu', 'School Orgg', NULL, NULL, 'bayot', NULL, NULL, NULL, 'rejected', 5, '2026-04-15 10:07:56', 'Application rejected.', '2026-04-15 02:07:30', '2026-04-15 02:07:56');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `payment_reference` varchar(100) DEFAULT NULL,
  `provider` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'PHP',
  `payment_status` enum('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `refund_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `refund_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `payment_reference`, `provider`, `payment_method`, `amount`, `currency`, `payment_status`, `paid_at`, `refund_amount`, `refund_reason`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'manual', 'manual', 5500.00, 'PHP', 'success', '2026-04-14 01:30:31', 0.00, NULL, '2026-04-13 16:37:21', '2026-04-13 17:30:31'),
(2, 2, NULL, 'manual', 'manual', 1500.00, 'PHP', 'success', '2026-04-15 10:44:50', 0.00, NULL, '2026-04-15 02:38:09', '2026-04-15 02:44:50');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `speakers`
--

CREATE TABLE `speakers` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `title` varchar(150) DEFAULT NULL,
  `company` varchar(150) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `speakers`
--

INSERT INTO `speakers` (`id`, `name`, `email`, `phone`, `title`, `company`, `bio`, `photo`, `created_at`, `updated_at`) VALUES
(1, 'Marlon', 'Marlon@gmail.com', NULL, 'Marlon theeeeee Great!', 'Binangkal Company', 'Hello World', NULL, '2026-04-13 16:14:49', '2026-04-13 16:14:49'),
(2, 'Dr. Antonio Ramirez', 'antonio.ramirez@piti.org', NULL, 'Keynote Speaker – Digital Transformation in Southeast Asia', 'Philippine Institute of Technology & Innovation', 'Dr. Antonio Ramirez is a leading expert in digital transformation and smart city initiatives across Southeast Asia. With over 20 years of experience in technology policy, innovation ecosystems, and enterprise modernization, he has advised governments and corporations on sustainable digital strategies. He is a published author, frequent conference speaker, and advocate for inclusive tech-driven growth in the Philippines and beyond.', NULL, '2026-04-15 02:29:04', '2026-04-15 02:29:04');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `subject` varchar(200) NOT NULL,
  `issue_type` enum('complaint','refund','technical','other') NOT NULL DEFAULT 'other',
  `description` text NOT NULL,
  `status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `assigned_admin_id` int(11) DEFAULT NULL,
  `resolution_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket_types`
--

CREATE TABLE `ticket_types` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `quantity_available` int(11) NOT NULL DEFAULT 0,
  `quantity_sold` int(11) NOT NULL DEFAULT 0,
  `sale_start` datetime DEFAULT NULL,
  `sale_end` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_types`
--

INSERT INTO `ticket_types` (`id`, `event_id`, `name`, `description`, `price`, `quantity_available`, `quantity_sold`, `sale_start`, `sale_end`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Soft World Tour', 'palit namo dol', 5500.00, 3400, 1, NULL, NULL, 1, '2026-04-13 16:15:55', '2026-04-13 16:37:21'),
(2, 2, 'General Admission', 'Access to all keynote sessions, panels, and exhibits at the Cebu City Convention Center.', 1500.00, 5000, 1, NULL, NULL, 1, '2026-04-15 02:31:21', '2026-04-15 02:38:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','organizer','user') NOT NULL DEFAULT 'user',
  `status` enum('active','pending','suspended','rejected') NOT NULL DEFAULT 'active',
  `phone` varchar(30) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`, `phone`, `profile_image`, `email_verified`, `created_at`, `updated_at`) VALUES
(2, 'Lonmar Olot', 'lonmar@gmail.com', '$2b$10$ZDJR0uGhB2ezkFiRiH3pkuAemeUNpalojuEJOQXtkcFP6pQXzySri', 'organizer', 'active', '09876253412', NULL, 0, '2026-04-13 15:32:00', '2026-04-13 16:08:27'),
(5, 'Admin', 'admin@tuloclicks.com', '$2b$10$a1KL2dxm16BFp3wvGkJaqurLUr0umAUgxTPrsuJhQqeGGaNZP/Ixy', 'admin', 'active', NULL, NULL, 0, '2026-04-13 16:01:08', '2026-04-13 16:02:38'),
(6, 'RozenCranks Tiuname', 'cranks@gmail.com', '$2b$10$kpTpdtBjT9hp9LwPY0.BRuquQnYQn02UbbEZfI.TJrYk7KfR4NvS.', 'user', 'active', '09987645261', NULL, 0, '2026-04-13 16:30:07', '2026-04-13 16:30:07'),
(7, 'Ericksyon Onyada', 'ericksyon@gmail.com', '$2b$10$deDGWbDloElnAmzldb4reOLUa4WInltZXVN00VXvKQsfrWHLKqwQG', 'user', 'rejected', '09987364526', NULL, 0, '2026-04-14 22:43:15', '2026-04-15 02:07:56'),
(8, 'Jane Doe', 'janedoe@gmail.com', '$2b$10$hPUp4nMu0J9R14MdWrAX9uJoH5vsWENJnHLw4WipE8uBMx4OAgVDu', 'organizer', 'active', '092837465121', NULL, 0, '2026-04-15 02:01:21', '2026-04-15 02:06:56'),
(9, 'Marnol jay Tolo', 'marnoljaytolo@gmail.com', '$2b$10$t1.4wxWU1lC1UphMyue.3.r0HBGLhnjKlc0ELSq8bfKYXqXyVX5PK', 'user', 'active', '08897265431', NULL, 0, '2026-04-15 02:34:42', '2026-04-15 02:34:42');

-- --------------------------------------------------------

--
-- Table structure for table `venues`
--

CREATE TABLE `venues` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) DEFAULT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'Philippines',
  `postal_code` varchar(20) DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `contact_person` varchar(150) DEFAULT NULL,
  `contact_phone` varchar(30) DEFAULT NULL,
  `contact_email` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `venues`
--

INSERT INTO `venues` (`id`, `name`, `address`, `city`, `province`, `country`, `postal_code`, `capacity`, `contact_person`, `contact_phone`, `contact_email`, `created_at`, `updated_at`) VALUES
(1, 'SM Seaside Cebu Arena', 'South Road Properties', 'Cebu City', 'Cebu', 'Philippines', '6000', 16000, 'Venue Office', '09285143302', 'smseaside@example.com', '2026-04-13 04:07:53', '2026-04-13 04:07:53'),
(2, 'Waterfront Cebu City Hotel & Casino', 'Salinas Drive, Lahug', 'Cebu City', 'Cebu', 'Philippines', '6000', 1000, 'Venue Office', '+63 32 232 6888', 'waterfront@example.com', '2026-04-13 04:07:53', '2026-04-13 04:07:53'),
(3, 'Cebu City Convention Center', 'North Reclamation Area, Cebu City, Cebu', 'Cebu City', 'Cebu City', 'Philippines', '6000', 5000, 'Maria Santos', '+63 32 123 4567', 'info@cebucityconvention.ph', '2026-04-15 02:23:06', '2026-04-15 02:23:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_activity_logs_user` (`user_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_reference` (`booking_reference`),
  ADD KEY `fk_bookings_user` (`user_id`),
  ADD KEY `fk_bookings_event` (`event_id`);

--
-- Indexes for table `booking_items`
--
ALTER TABLE `booking_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_booking_items_booking` (`booking_id`),
  ADD KEY `fk_booking_items_ticket_type` (`ticket_type_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_events_organizer` (`organizer_id`),
  ADD KEY `fk_events_category` (`category_id`),
  ADD KEY `fk_events_venue` (`venue_id`),
  ADD KEY `fk_events_approved_by` (`approved_by`),
  ADD KEY `fk_events_rejected_by` (`rejected_by`);

--
-- Indexes for table `event_categories`
--
ALTER TABLE `event_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `event_speakers`
--
ALTER TABLE `event_speakers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_event_speaker` (`event_id`,`speaker_id`),
  ADD KEY `fk_event_speakers_speaker` (`speaker_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notifications_user` (`user_id`);

--
-- Indexes for table `organizer_profiles`
--
ALTER TABLE `organizer_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `fk_organizer_profile_admin` (`approved_by`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_reference` (`payment_reference`),
  ADD KEY `fk_payments_booking` (`booking_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_review_user_event` (`user_id`,`event_id`),
  ADD KEY `fk_reviews_event` (`event_id`);

--
-- Indexes for table `speakers`
--
ALTER TABLE `speakers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_support_user` (`user_id`),
  ADD KEY `fk_support_booking` (`booking_id`),
  ADD KEY `fk_support_event` (`event_id`),
  ADD KEY `fk_support_admin` (`assigned_admin_id`);

--
-- Indexes for table `ticket_types`
--
ALTER TABLE `ticket_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ticket_types_event` (`event_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `venues`
--
ALTER TABLE `venues`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `booking_items`
--
ALTER TABLE `booking_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `event_categories`
--
ALTER TABLE `event_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `event_speakers`
--
ALTER TABLE `event_speakers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `organizer_profiles`
--
ALTER TABLE `organizer_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `speakers`
--
ALTER TABLE `speakers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ticket_types`
--
ALTER TABLE `ticket_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `venues`
--
ALTER TABLE `venues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_activity_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_bookings_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `booking_items`
--
ALTER TABLE `booking_items`
  ADD CONSTRAINT `fk_booking_items_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_booking_items_ticket_type` FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_events_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_events_category` FOREIGN KEY (`category_id`) REFERENCES `event_categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_events_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_events_rejected_by` FOREIGN KEY (`rejected_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_events_venue` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `event_speakers`
--
ALTER TABLE `event_speakers`
  ADD CONSTRAINT `fk_event_speakers_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_event_speakers_speaker` FOREIGN KEY (`speaker_id`) REFERENCES `speakers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organizer_profiles`
--
ALTER TABLE `organizer_profiles`
  ADD CONSTRAINT `fk_organizer_profile_admin` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_organizer_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `fk_support_admin` FOREIGN KEY (`assigned_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_support_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_support_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_support_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket_types`
--
ALTER TABLE `ticket_types`
  ADD CONSTRAINT `fk_ticket_types_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
