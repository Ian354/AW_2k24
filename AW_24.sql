-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 02, 2024 at 04:33 PM
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
  `capacidad` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventos`
--

INSERT INTO `eventos` (`id`, `organizador`, `titulo`, `descripcion`, `fecha`, `hora`, `tipo`, `ubicacion`, `capacidad`, `activo`) VALUES
(3, 5, 'Futbol', 'Partido de año nuevo', '2024-12-31', '12:00:00', 'Taller', 'Paraninfo', 3, 1),
(42, 11, 'Tech Conference 2024', 'Annual technology conference.', '2024-11-29', '10:00:00', 'Taller', 'Conference Hall A', 100, 1),
(43, 12, 'Mathematical Wonders', 'Exploration of mathematical discoveries.', '2024-12-10', '14:00:00', 'Seminario', 'Math Building', 50, 1),
(44, 13, 'Business Algorithms Workshop', 'How algorithms shape industries.', '2024-11-30', '09:00:00', 'Taller', 'Room 203', 30, 1),
(45, 14, 'Number Theory Seminar', 'Discussion on advanced number theory.', '2024-12-01', '11:00:00', 'Seminario', 'Auditorium', 70, 1),
(46, 5, 'AI in Mathematics', 'Exploration of AI-driven calculations.', '2024-12-08', '13:00:00', 'Conferencia', 'Expo Center', 200, 1),
(47, 6, 'Python Bootcamp', 'Learn Python basics.', '2024-11-29', '08:00:00', 'Taller', 'Room 101', 25, 1),
(48, 7, 'Health Informatics', 'Promoting healthcare IT solutions.', '2024-12-03', '10:00:00', 'Conferencia', 'Health Center', 80, 1),
(49, 8, 'Data Science in Academia', 'Role of data in modern education.', '2024-12-15', '15:00:00', 'Seminario', 'Studio B', 20, 1),
(50, 9, 'Machine Learning Concert', 'Fun showcase of ML-generated music.', '2024-12-12', '19:00:00', 'Conferencia', 'Open Grounds', 150, 1),
(51, 10, 'Cryptography Play', 'Encryption through performance art.', '2024-12-14', '18:00:00', 'Seminario', 'Theater', 60, 1),
(52, 11, 'Environmental Modeling Talk', 'Using math to predict climate change.', '2024-12-04', '11:30:00', 'Conferencia', 'Room 305', 40, 1),
(53, 12, 'Advanced AI Workshop', 'Deep dive into Artificial Intelligence.', '2024-12-07', '09:30:00', 'Taller', 'Lab 3', 30, 1),
(54, 13, 'Database Optimization', 'Best practices for SQL.', '2024-12-02', '16:00:00', 'Taller', 'Culinary Room', 15, 1),
(55, 14, 'Graph Theory Class', 'Exploration of network models.', '2024-11-28', '17:00:00', 'Seminario', 'Studio A', 25, 1),
(56, 15, 'Mathematical Book Reading', 'Author reading and Q&A.', '2024-12-09', '14:30:00', 'Seminario', 'Library Hall', 40, 1),
(57, 11, 'Morning Calculus', 'Discussion on integrals and derivatives.', '2024-12-11', '07:00:00', 'Seminario', 'Garden Area', 20, 1),
(58, 12, 'Robotics Exhibition', 'Showcase of robotic projects.', '2024-12-13', '10:00:00', 'Conferencia', 'Tech Lab', 100, 1),
(59, 13, 'Algorithmic Thinking', 'Understanding problem-solving approaches.', '2024-12-06', '12:00:00', 'Seminario', 'Room 201', 50, 1),
(60, 14, 'Volunteer Meetup', 'Engaging math and IT volunteers.', '2024-12-16', '16:30:00', 'Taller', 'Community Center', 30, 1),
(61, 5, 'Yoga', 'chillin', '2024-12-01', '12:00:00', 'Conferencia', 'Informática', 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `inscripciones`
--

CREATE TABLE `inscripciones` (
  `usuario_id` int(11) NOT NULL,
  `evento_id` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `fecha` datetime NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inscripciones`
--

INSERT INTO `inscripciones` (`usuario_id`, `evento_id`, `estado`, `fecha`, `activo`) VALUES
(5, 43, 'apuntado_1', '2024-12-01 00:00:00', 1),
(5, 48, 'apuntado_1', '2024-12-01 00:00:00', 1),
(5, 49, 'apuntado_1', '2024-12-01 00:00:00', 1),
(5, 50, 'apuntado_1', '2024-12-01 00:00:00', 1),
(5, 51, 'apuntado_1', '2024-12-01 00:00:00', 1),
(5, 52, 'apuntado_1', '2024-12-01 00:00:00', 1),
(5, 53, 'apuntado_2', '2024-12-01 00:00:00', 1),
(5, 56, 'apuntado_1', '2024-12-01 00:00:00', 1),
(5, 59, 'apuntado_1', '2024-12-01 00:00:00', 1),
(6, 3, 'apuntado_3', '2024-12-01 00:00:00', 1),
(6, 43, 'apuntado_2', '2024-12-01 00:00:00', 1),
(6, 48, 'apuntado_2', '2024-12-01 00:00:00', 1),
(6, 50, 'apuntado_2', '2024-12-01 00:00:00', 1),
(6, 51, 'apuntado_2', '2024-12-01 00:00:00', 1),
(6, 52, 'apuntado_2', '2024-12-01 00:00:00', 1),
(6, 53, 'apuntado_1', '2024-12-01 00:00:00', 1),
(6, 54, 'apuntado_1', '2024-12-01 00:00:00', 1),
(6, 58, 'apuntado_1', '2024-12-01 00:00:00', 1),
(6, 59, 'apuntado_2', '2024-12-01 00:00:00', 1),
(7, 3, 'apuntado_1', '2024-12-01 11:28:41', 1),
(8, 3, 'apuntado_2', '2024-12-01 11:28:41', 1),
(8, 53, 'apuntado_3', '2024-12-01 00:00:00', 1);

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
  `hora` datetime NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `id_usuario`, `titulo`, `contenido`, `mostrado`, `hora`, `activo`) VALUES
(46, 5, 'Estás apuntado!', 'Estás apuntado en el evento Health Informatics', 1, '2024-12-01 10:48:39', 1),
(47, 5, 'Estás apuntado!', 'Estás apuntado en el evento Environmental Modeling Talk', 1, '2024-12-01 10:53:03', 1),
(48, 5, 'Estás apuntado!', 'Estás apuntado en el evento Machine Learning Concert', 1, '2024-12-01 11:15:48', 1),
(49, 5, 'Estás apuntado!', 'Estás apuntado en el evento Cryptography Play', 1, '2024-12-01 11:23:33', 1),
(50, 5, 'Estás apuntado!', 'Estás apuntado en el evento Algorithmic Thinking', 1, '2024-12-01 11:25:21', 1),
(51, 5, 'Estás apuntado!', 'Estás apuntado en el evento Algorithmic Thinking', 1, '2024-12-01 11:25:22', 1),
(52, 5, 'Estás apuntado!', 'Estás apuntado en el evento Mathematical Wonders', 1, '2024-12-01 11:27:08', 1),
(53, 5, 'Estás apuntado!', 'Estás apuntado en el evento Data Science in Academia', 1, '2024-12-01 11:28:17', 1),
(54, 5, 'Estás apuntado!', 'Estás apuntado en el evento Mathematical Book Reading', 1, '2024-12-01 11:28:23', 1),
(55, 5, 'Estás en la lista de espera', 'Aviso: Estás en la lista de espera en el puesto 1 en el evento Futbol', 1, '2024-12-01 11:34:46', 1),
(56, 5, 'Estás en la lista de espera', 'Aviso: Estás en la lista de espera en el puesto 2 en el evento Futbol', 1, '2024-12-01 11:37:52', 1),
(57, 5, 'Estás en la lista de espera', 'Aviso: Estás en la lista de espera en el puesto 2 en el evento Futbol', 1, '2024-12-01 11:39:56', 1),
(58, 5, 'Estás en la lista de espera', 'Aviso: Estás en la lista de espera en el puesto 2 en el evento Futbol', 1, '2024-12-01 11:41:46', 1),
(59, 9, 'Has sido eliminado del evento Futbol', 'Lamentamos informarle que el organizador del evento le ha eliminado del evento', 0, '2024-12-01 11:55:06', 1),
(60, 5, '¡Enhorabuena! Has sido movido a la lista de apuntados del evento Futbol', 'El organizador del evento te ha movido a la lista de apuntados', 1, '2024-12-01 11:55:06', 1),
(61, 6, 'Estás apuntado!', 'Estás apuntado en el evento Environmental Modeling Talk', 1, '2024-12-01 12:56:42', 1),
(63, 6, 'Estás apuntado!', 'Estás apuntado en el evento Environmental Modeling Talk', 1, '2024-12-01 13:02:47', 1),
(64, 6, 'Estás apuntado!', 'Estás apuntado en el evento Mathematical Wonders', 1, '2024-12-01 13:04:55', 1),
(65, 6, 'Estás apuntado!', 'Estás apuntado en el evento Mathematical Wonders', 1, '2024-12-01 13:04:59', 1),
(66, 6, 'Estás apuntado!', 'Estás apuntado en el evento Advanced AI Workshop', 1, '2024-12-01 13:08:48', 1),
(67, 6, 'Estás apuntado!', 'Estás apuntado en el evento Advanced AI Workshop', 1, '2024-12-01 13:08:51', 1),
(68, 6, 'Estás apuntado!', 'Estás apuntado en el evento Cryptography Play', 1, '2024-12-01 13:09:51', 1),
(69, 6, 'Estás apuntado!', 'Estás apuntado en el evento Cryptography Play', 1, '2024-12-01 13:09:53', 1),
(70, 6, 'Estás apuntado!', 'Estás apuntado en el evento Environmental Modeling Talk', 1, '2024-12-01 13:12:40', 1),
(71, 6, 'Estás apuntado!', 'Estás apuntado en el evento Data Science in Academia', 1, '2024-12-01 13:18:19', 1),
(72, 6, 'Estás apuntado!', 'Estás apuntado en el evento Machine Learning Concert', 1, '2024-12-01 13:18:58', 1),
(73, 5, 'Has sido eliminado del evento Futbol', 'Lamentamos informarle que el organizador del evento le ha eliminado del evento', 1, '2024-12-01 14:42:01', 1),
(74, 6, '¡Enhorabuena! Has sido movido a la lista de apuntados del evento Futbol', 'El organizador del evento te ha movido a la lista de apuntados', 0, '2024-12-01 14:42:01', 1),
(75, 5, 'Hola', 'Que tal', 1, '2024-12-01 14:43:15', 1),
(76, 5, 'Estás apuntado!', 'Estás apuntado en el evento Advanced AI Workshop', 1, '2024-12-01 14:45:08', 1),
(77, 8, 'Estás apuntado!', 'Estás apuntado en el evento Advanced AI Workshop', 1, '2024-12-01 14:46:25', 1);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `ID` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `rol` varchar(100) NOT NULL DEFAULT 'no',
  `correo` varchar(50) NOT NULL,
  `telefono` int(11) NOT NULL,
  `facultad` varchar(50) NOT NULL,
  `contraseña` varchar(50) NOT NULL,
  `lista_negra` tinyint(1) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`ID`, `nombre`, `rol`, `correo`, `telefono`, `facultad`, `contraseña`, `lista_negra`, `activo`) VALUES
(5, 'Ian', 'organizador', 'ian@ucm.es', 123456789, 'informatica', '123', 0, 1),
(6, 'Alice Johnson', 'no', 'alice.johnson@ucm.es', 1234567890, 'informatica', 'password1', 0, 1),
(7, 'Bob Smith', 'no', 'bob.smith@ucm.es', 1234567891, 'informatica', 'password2', 0, 1),
(8, 'Charlie Brown', 'no', 'charlie.brown@ucm.es', 1234567892, 'informatica', 'password3', 0, 1),
(9, 'Diana Prince', 'no', 'diana.prince@ucm.es', 1234567893, 'matematicas', 'password4', 0, 1),
(10, 'Eve Adams', 'no', 'eve.adams@ucm.es', 1234567894, 'matematicas', 'password5', 0, 1),
(11, 'Frank White', 'no', 'frank.white@ucm.es', 1234567895, 'fisica', 'password6', 0, 1),
(12, 'Grace Hopper', 'no', 'grace.hopper@ucm.es', 1234567896, 'matematicas', 'password7', 0, 1),
(13, 'Hank Green', 'no', 'hank.green@ucm.es', 1234567897, 'informatica', 'password8', 0, 1),
(14, 'Isla Fisher', 'no', 'isla.fisher@ucm.es', 1234567898, 'informatica', 'password9', 0, 1),
(15, 'Jake Long', 'no', 'jake.long@ucm.es', 1234567899, 'informatica', 'password10', 0, 1),
(16, 'Kelly Brooks', 'no', 'kelly.brooks@ucm.es', 1234567880, 'informatica', 'password11', 0, 1),
(17, 'Liam Gray', 'no', 'liam.gray@ucm.es', 1234567881, 'informatica', 'password12', 0, 1),
(18, 'Mia Torres', 'no', 'mia.torres@ucm.es', 1234567882, 'biologia', 'password13', 0, 1),
(19, 'Noah Bennett', 'no', 'noah.bennett@ucm.es', 1234567883, 'biologia', 'password14', 0, 1),
(20, 'Olivia Brown', 'no', 'olivia.brown@ucm.es', 1234567884, 'biologia', 'password15', 0, 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

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
