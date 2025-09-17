-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 13-09-2025 a las 01:15:15
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lacafetalera`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

DROP TABLE IF EXISTS `categoria`;
CREATE TABLE IF NOT EXISTS `categoria` (
  `id_categoria` int NOT NULL,
  `nombre` varchar(30) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre`) VALUES
(1, 'Café Molido'),
(2, 'Café en Grano'),
(3, 'Café Instantáneo'),
(4, 'Café Orgánico'),
(5, 'Accesorios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_producto`
--

DROP TABLE IF EXISTS `detalle_producto`;
CREATE TABLE IF NOT EXISTS `detalle_producto` (
  `id_detalle` int NOT NULL,
  `id_pedido` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_pedido` (`id_pedido`),
  KEY `id_producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `detalle_producto`
--

INSERT INTO `detalle_producto` (`id_detalle`, `id_pedido`, `id_producto`, `cantidad`, `subtotal`) VALUES
(1, 1, 1, 2, 36000.00),
(2, 1, 5, 1, 12000.00),
(3, 2, 2, 1, 35000.00),
(4, 3, 3, 3, 28500.00),
(5, 4, 4, 2, 44000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

DROP TABLE IF EXISTS `pedido`;
CREATE TABLE IF NOT EXISTS `pedido` (
  `id_pedido` int NOT NULL,
  `fecha_pedido` date NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id_pedido`, `fecha_pedido`, `id_usuario`) VALUES
(1, '2025-09-10', 2),
(2, '2025-09-11', 3),
(3, '2025-09-11', 4),
(4, '2025-09-12', 2),
(5, '2025-09-12', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` int NOT NULL,
  `id_categoria` int NOT NULL,
  `nombre` varchar(20) COLLATE utf8mb3_spanish_ci NOT NULL,
  `precioUnitario` decimal(12,2) NOT NULL,
  `stock` int NOT NULL,
  `descripcion` varchar(250) COLLATE utf8mb3_spanish_ci NOT NULL,
  `imagen` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `id_categoria` (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `id_categoria`, `nombre`, `precioUnitario`, `stock`, `descripcion`, `imagen`) VALUES
(1, 1, 'Café Suave 500g', 18000.00, 25, 'Café molido de origen colombiano', 'img/cafe_suave.jpg'),
(2, 2, 'Café en Grano Premiu', 35000.00, 15, 'Granos seleccionados de alta calidad', 'img/cafe_grano.jpg'),
(3, 3, 'Café Instantáneo Clá', 9500.00, 40, 'Instantáneo y de fácil preparación', 'img/cafe_insta.jpg'),
(4, 4, 'Café Orgánico Sierra', 22000.00, 30, 'Café orgánico de montaña', 'img/organico_sierra.jpg'),
(5, 5, 'Filtro Reutilizable', 12000.00, 50, 'Filtro de acero inoxidable para café', 'img/filtro.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int NOT NULL,
  `nombre` varchar(30) COLLATE utf8mb3_spanish_ci NOT NULL,
  `apellido` varchar(30) COLLATE utf8mb3_spanish_ci NOT NULL,
  `telefono` int NOT NULL,
  `correo` varchar(30) COLLATE utf8mb3_spanish_ci NOT NULL,
  `rol` varchar(10) COLLATE utf8mb3_spanish_ci NOT NULL,
  `contraseña` varchar(50) COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `telefono`, `correo`, `rol`, `contraseña`) VALUES
(1, 'Sebastián', 'Hernández', 2147483647, 'sebastian@correo.com', 'admin', '$2b$10$Ejemplo1'),
(2, 'Laura', 'Martínez', 2147483647, 'laura@correo.com', 'usuario', '$2b$10$Ejemplo2'),
(3, 'Carlos', 'Gómez', 2147483647, 'carlos@correo.com', 'usuario', '$2b$10$Ejemplo3'),
(4, 'Ana', 'Ríos', 2147483647, 'ana@correo.com', 'usuario', '$2b$10$Ejemplo4'),
(5, 'Andrés', 'López', 2147483647, 'andres@correo.com', 'usuario', '$2b$10$Ejemplo5');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_producto`
--
ALTER TABLE `detalle_producto`
  ADD CONSTRAINT `detalle_producto_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`),
  ADD CONSTRAINT `detalle_producto_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
