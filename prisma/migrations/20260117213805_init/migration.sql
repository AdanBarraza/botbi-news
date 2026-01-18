-- CreateTable
CREATE TABLE `Noticias` (
    `id` VARCHAR(191) NOT NULL,
    `urlFuente` VARCHAR(191) NOT NULL,
    `nombreFuente` VARCHAR(191) NOT NULL,
    `categoria` ENUM('TECNOLOGIA', 'NEGOCIOS') NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `fechaPublicacion` DATETIME(3) NOT NULL,
    `contenidoOriginal` LONGTEXT NOT NULL,
    `contenidoIA` LONGTEXT NOT NULL,
    `puntajeRelevancia` INTEGER NOT NULL DEFAULT 0,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Noticias_urlFuente_key`(`urlFuente`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Suscriptor` (
    `id` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `fechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Suscriptor_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
