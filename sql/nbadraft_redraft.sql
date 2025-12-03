CREATE TABLE `redraft` (
  `redraft_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `year` varchar(10) NOT NULL,
  `draft_data` JSON NOT NULL,
  `created_at` timestamp(3) NOT NULL DEFAULT (now(3)),
  `updated_at` timestamp(3) NOT NULL DEFAULT (now(3)) ON UPDATE now(3),
  PRIMARY KEY (`id`),
  KEY `redraft_user_id_fk` (`user_id`),
  CONSTRAINT `redraft_user_id_fk`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
