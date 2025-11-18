CREATE TABLE `draft` (
  `draft_id` varchar(36) NOT NULL,
  `draft_year` year NOT NULL,
  `location` varchar(100) NOT NULL,
  `draft_date` timestamp(3) NOT NULL,
  `created_at` timestamp(3) NOT NULL DEFAULT (now(3)),
  `updated_at` timestamp(3) NOT NULL DEFAULT (now(3)) ON UPDATE now(3),
  PRIMARY KEY (`draft_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;