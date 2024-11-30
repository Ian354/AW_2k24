-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 30, 2024 at 03:34 PM
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
-- Database: `AW_24`
--

-- --------------------------------------------------------

--
-- Table structure for table `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `organizador` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `ubicacion` varchar(100) NOT NULL,
  `capacidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventos`
--

INSERT INTO `eventos` (`id`, `organizador`, `titulo`, `descripcion`, `fecha`, `hora`, `tipo`, `ubicacion`, `capacidad`) VALUES
(3, 5, 'Futbol', 'Partido de año nuevo', '2024-12-31', '12:00:00', 'Taller', 'Paraninfo', 3),
(42, 11, 'Tech Conference 2024', 'Annual technology conference.', '2024-11-29', '10:00:00', 'Taller', 'Conference Hall A', 100),
(43, 12, 'Mathematical Wonders', 'Exploration of mathematical discoveries.', '2024-12-10', '14:00:00', 'Seminario', 'Math Building', 50),
(44, 13, 'Business Algorithms Workshop', 'How algorithms shape industries.', '2024-11-30', '09:00:00', 'Taller', 'Room 203', 30),
(45, 14, 'Number Theory Seminar', 'Discussion on advanced number theory.', '2024-12-01', '11:00:00', 'Seminario', 'Auditorium', 70),
(46, 5, 'AI in Mathematics', 'Exploration of AI-driven calculations.', '2024-12-08', '13:00:00', 'Conferencia', 'Expo Center', 200),
(47, 6, 'Python Bootcamp', 'Learn Python basics.', '2024-11-29', '08:00:00', 'Taller', 'Room 101', 25),
(48, 7, 'Health Informatics', 'Promoting healthcare IT solutions.', '2024-12-03', '10:00:00', 'Conferencia', 'Health Center', 80),
(49, 8, 'Data Science in Academia', 'Role of data in modern education.', '2024-12-15', '15:00:00', 'Seminario', 'Studio B', 20),
(50, 9, 'Machine Learning Concert', 'Fun showcase of ML-generated music.', '2024-12-12', '19:00:00', 'Conferencia', 'Open Grounds', 150),
(51, 10, 'Cryptography Play', 'Encryption through performance art.', '2024-12-14', '18:00:00', 'Seminario', 'Theater', 60),
(52, 11, 'Environmental Modeling Talk', 'Using math to predict climate change.', '2024-12-04', '11:30:00', 'Conferencia', 'Room 305', 40),
(53, 12, 'Advanced AI Workshop', 'Deep dive into Artificial Intelligence.', '2024-12-07', '09:30:00', 'Taller', 'Lab 3', 30),
(54, 13, 'Database Optimization', 'Best practices for SQL.', '2024-12-02', '16:00:00', 'Taller', 'Culinary Room', 15),
(55, 14, 'Graph Theory Class', 'Exploration of network models.', '2024-11-28', '17:00:00', 'Seminario', 'Studio A', 25),
(56, 15, 'Mathematical Book Reading', 'Author reading and Q&A.', '2024-12-09', '14:30:00', 'Seminario', 'Library Hall', 40),
(57, 11, 'Morning Calculus', 'Discussion on integrals and derivatives.', '2024-12-11', '07:00:00', 'Seminario', 'Garden Area', 20),
(58, 12, 'Robotics Exhibition', 'Showcase of robotic projects.', '2024-12-13', '10:00:00', 'Conferencia', 'Tech Lab', 100),
(59, 13, 'Algorithmic Thinking', 'Understanding problem-solving approaches.', '2024-12-06', '12:00:00', 'Seminario', 'Room 201', 50),
(60, 14, 'Volunteer Meetup', 'Engaging math and IT volunteers.', '2024-12-16', '16:30:00', 'Taller', 'Community Center', 30),
(61, 5, 'Yoga', 'chillin', '2024-12-01', '12:00:00', 'Conferencia', 'Informática', 10);

-- --------------------------------------------------------

--
-- Table structure for table `inscripciones`
--

CREATE TABLE `inscripciones` (
  `usuario_id` int(11) NOT NULL,
  `evento_id` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inscripciones`
--

INSERT INTO `inscripciones` (`usuario_id`, `evento_id`, `estado`, `fecha`) VALUES
(5, 44, 'apuntado_01', '2024-11-27 00:00:00'),
(5, 50, 'apuntado_01', '2024-11-27 00:00:00'),
(5, 53, 'apuntado_01', '2024-11-27 00:00:00'),
(5, 59, 'apuntado_01', '2024-11-27 00:00:00'),
(5, 60, 'apuntado_01', '2024-11-27 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido` text NOT NULL,
  `mostrado` tinyint(1) NOT NULL DEFAULT 0,
  `hora` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `id_usuario`, `titulo`, `contenido`, `mostrado`, `hora`) VALUES
(1, 5, 'Evento Eliminado', 'El evento Futbol se ha eliminado y no podrás acudir', 1, '2024-11-30 11:31:46'),
(2, 5, 'Has sido Desapuntado', 'Has sido desapuntado del Evento Baloncesto por su organizador', 1, '2024-11-30 11:31:46'),
(3, 5, 'Nueva Notificacion', 'Hola Muy buenas señor', 1, '2024-11-30 13:54:18'),
(4, 5, 'Nuevo Futbol', 'Hay más futbol!', 1, '2024-11-30 15:07:16'),
(6, 5, 'Nuevo Baloncesto', 'Cada vez más', 1, '2024-11-30 15:11:36'),
(7, 5, 'Notificacion', 'lnvuebviupbrbai', 1, '2024-11-30 15:24:55'),
(8, 5, 'A ver si Ahora', 'hbuoyvo', 1, '2024-11-30 15:28:30');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `ID` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `correo` varchar(50) NOT NULL,
  `telefono` int(11) NOT NULL,
  `facultad` varchar(50) NOT NULL,
  `contraseña` varchar(50) NOT NULL,
  `lista_negra` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`ID`, `nombre`, `correo`, `telefono`, `facultad`, `contraseña`, `lista_negra`) VALUES
(5, 'Ian', 'ian@ucm.es', 123456789, 'informatica', '123', 0),
(6, 'Alice Johnson', 'alice.johnson@ucm.es', 1234567890, 'informatica', 'password1', 0),
(7, 'Bob Smith', 'bob.smith@ucm.es', 1234567891, 'informatica', 'password2', 0),
(8, 'Charlie Brown', 'charlie.brown@ucm.es', 1234567892, 'informatica', 'password3', 0),
(9, 'Diana Prince', 'diana.prince@ucm.es', 1234567893, 'matematicas', 'password4', 0),
(10, 'Eve Adams', 'eve.adams@ucm.es', 1234567894, 'matematicas', 'password5', 0),
(11, 'Frank White', 'frank.white@ucm.es', 1234567895, 'fisica', 'password6', 0),
(12, 'Grace Hopper', 'grace.hopper@ucm.es', 1234567896, 'matematicas', 'password7', 0),
(13, 'Hank Green', 'hank.green@ucm.es', 1234567897, 'informatica', 'password8', 0),
(14, 'Isla Fisher', 'isla.fisher@ucm.es', 1234567898, 'informatica', 'password9', 0),
(15, 'Jake Long', 'jake.long@ucm.es', 1234567899, 'informatica', 'password10', 0),
(16, 'Kelly Brooks', 'kelly.brooks@ucm.es', 1234567880, 'informatica', 'password11', 0),
(17, 'Liam Gray', 'liam.gray@ucm.es', 1234567881, 'informatica', 'password12', 0),
(18, 'Mia Torres', 'mia.torres@ucm.es', 1234567882, 'biologia', 'password13', 0),
(19, 'Noah Bennett', 'noah.bennett@ucm.es', 1234567883, 'biologia', 'password14', 0),
(20, 'Olivia Brown', 'olivia.brown@ucm.es', 1234567884, 'biologia', 'password15', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_organizador_usuario` (`organizador`);

--
-- Indexes for table `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`usuario_id`,`evento_id`),
  ADD KEY `relacion_evento` (`evento_id`);

--
-- Indexes for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notificacion_usuario` (`id_usuario`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `fk_organizador_usuario` FOREIGN KEY (`organizador`) REFERENCES `usuarios` (`ID`);

--
-- Constraints for table `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `relacion_evento` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`),
  ADD CONSTRAINT `relacion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`ID`);

--
-- Constraints for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `fk_notificacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
