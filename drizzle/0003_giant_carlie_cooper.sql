CREATE TABLE `user_comments` (
	`comment_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`redraft_id` varchar(36) NOT NULL,
	`comment_text` text NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_comments_comment_id` PRIMARY KEY(`comment_id`)
);
--> statement-breakpoint
ALTER TABLE `user_comments` ADD CONSTRAINT `user_comments_redraft_id_redraft_redraft_id_fk` FOREIGN KEY (`redraft_id`) REFERENCES `redraft`(`redraft_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_user_comments_user` ON `user_comments` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_user_comments_redraft` ON `user_comments` (`redraft_id`);--> statement-breakpoint
CREATE INDEX `idx_user_comments_redraft_created` ON `user_comments` (`redraft_id`,`created_at`);