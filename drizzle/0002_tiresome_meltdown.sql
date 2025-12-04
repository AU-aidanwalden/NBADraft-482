CREATE TABLE `city` (
	`city_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`country` varchar(100) NOT NULL,
	`state` varchar(100),
	CONSTRAINT `city_city_id` PRIMARY KEY(`city_id`)
);
--> statement-breakpoint
CREATE TABLE `redraft` (
	`redraft_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`year` int NOT NULL,
	`draft_data` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `redraft_redraft_id` PRIMARY KEY(`redraft_id`)
);
--> statement-breakpoint
CREATE TABLE `redraft_player` (
	`redraft_player_id` varchar(36) NOT NULL,
	`redraft_id` varchar(36) NOT NULL,
	`player_id` int NOT NULL,
	`team_id` int NOT NULL,
	`round` tinyint NOT NULL,
	`round_index` tinyint NOT NULL,
	`pick_number` smallint NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `redraft_player_redraft_player_id` PRIMARY KEY(`redraft_player_id`),
	CONSTRAINT `redraft_pick_unique` UNIQUE(`redraft_id`,`pick_number`)
);
--> statement-breakpoint
ALTER TABLE `draft_player` ADD CONSTRAINT `draft_pick_unique` UNIQUE(`draft_id`,`pick_number`);--> statement-breakpoint
ALTER TABLE `team` ADD CONSTRAINT `team_slug_unique` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `redraft_player` ADD CONSTRAINT `redraft_player_redraft_id_redraft_redraft_id_fk` FOREIGN KEY (`redraft_id`) REFERENCES `redraft`(`redraft_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `redraft_player` ADD CONSTRAINT `redraft_player_player_id_player_player_id_fk` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `redraft_player` ADD CONSTRAINT `redraft_player_team_id_team_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `team`(`team_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `idx_city_name` ON `city` (`name`);--> statement-breakpoint
CREATE INDEX `idx_redraft_user` ON `redraft` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_redraft_year` ON `redraft` (`year`);--> statement-breakpoint
CREATE INDEX `idx_redraft_player_redraft` ON `redraft_player` (`redraft_id`);--> statement-breakpoint
CREATE INDEX `idx_redraft_player_player` ON `redraft_player` (`player_id`);--> statement-breakpoint
ALTER TABLE `draft_player` ADD CONSTRAINT `draft_player_draft_id_draft_draft_id_fk` FOREIGN KEY (`draft_id`) REFERENCES `draft`(`draft_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `draft_player` ADD CONSTRAINT `draft_player_player_id_player_player_id_fk` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `draft_player` ADD CONSTRAINT `draft_player_team_id_team_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `team`(`team_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `player` ADD CONSTRAINT `player_team_id_team_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `team`(`team_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `team` ADD CONSTRAINT `team_city_id_city_city_id_fk` FOREIGN KEY (`city_id`) REFERENCES `city`(`city_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `idx_draft_year` ON `draft` (`draft_year`);--> statement-breakpoint
CREATE INDEX `idx_draft_player_draft` ON `draft_player` (`draft_id`);--> statement-breakpoint
CREATE INDEX `idx_draft_player_player` ON `draft_player` (`player_id`);--> statement-breakpoint
CREATE INDEX `idx_player_name` ON `player` (`name`);--> statement-breakpoint
CREATE INDEX `idx_player_fame` ON `player` (`fame_score`);--> statement-breakpoint
CREATE INDEX `idx_player_team` ON `player` (`team_id`);--> statement-breakpoint
CREATE INDEX `idx_team_city` ON `team` (`city_id`);