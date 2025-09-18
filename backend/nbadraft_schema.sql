-- This schema file was made with help from ChatGPT

CREATE DATABASE IF NOT EXISTS `nbadraft`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `nbadraft`;

CREATE TABLE `Users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `passwordHash` CHAR(60) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `token_hash` CHAR(60) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `last_used_at` DATETIME(6) NULL,
  `expires_at` DATETIME(6) NOT NULL,
  `parent_id` BIGINT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sessions_token_hash` (`token_hash`),
  KEY `idx_sessions_user_id` (`user_id`),
  KEY `idx_sessions_expires_at` (`expires_at`),
  KEY `idx_sessions_parent_id` (`parent_id`),
  CONSTRAINT `fk_sessions_user`
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_sessions_parent`
    FOREIGN KEY (`parent_id`) REFERENCES `Sessions`(`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
