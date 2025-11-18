CREATE TABLE `redraft_player` (
  `redraft_player_id` varchar(36) NOT NULL,
  `redraft_id` varchar(36) NOT NULL,
  `player_id` varchar(36) NOT NULL,
  `round` tinyint NOT NULL,
  `round_index` tinyint NOT NULL,
  `pick_number` smallint NOT NULL,
  `created_at` timestamp(3) NOT NULL DEFAULT (now(3)),
  `updated_at` timestamp(3) NOT NULL DEFAULT (now(3)) ON UPDATE now(3),
  PRIMARY KEY (`redraft_player_id`),
  KEY `redraft_player_redraft_id_fk` (`redraft_id`),
  KEY `redraft_player_player_id_fk` (`player_id`),
  CONSTRAINT `redraft_player_redraft_id_fk`
    FOREIGN KEY (`redraft_id`)
    REFERENCES `redraft` (`redraft_id`)
    ON DELETE CASCADE,
  CONSTRAINT `redraft_player_player_id_fk`
    FOREIGN KEY (`player_id`)
    REFERENCES `player` (`player_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
