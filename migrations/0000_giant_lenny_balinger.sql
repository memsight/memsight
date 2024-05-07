-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `_cf_KV` (
	`key` text PRIMARY KEY NOT NULL,
	`value` blob
);
--> statement-breakpoint
CREATE TABLE `d1_migrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text,
	`applied_at` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`uri_hash` text NOT NULL,
	`url` text NOT NULL,
	`length` integer NOT NULL,
	`title` text NOT NULL,
	`site_name` text NOT NULL,
	`lang` text NOT NULL,
	`dir` text NOT NULL,
	`byline` text NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`text_content` text NOT NULL,
	`markdown` text NOT NULL,
	`published_at` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`opengraph` text NOT NULL,
	`wait_timeout` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`secret` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `white_lists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`user_name` text NOT NULL,
	`user_avatar` text NOT NULL,
	`name` text NOT NULL,
	`banner` text NOT NULL,
	`desc` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_notes_uri_hash` ON `notes` (`uri_hash`);--> statement-breakpoint
CREATE INDEX `idx_notes_user_id` ON `notes` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_tokens_user_id` ON `tokens` (`user_id`);
*/