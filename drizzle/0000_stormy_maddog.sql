CREATE TABLE `anime` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`release_date` integer NOT NULL,
	`cover_image_url` text NOT NULL,
	`nsfw` integer DEFAULT false,
	`mal_id` integer
);
--> statement-breakpoint
CREATE TABLE `download` (
	`id` text PRIMARY KEY NOT NULL,
	`episode_id` text NOT NULL,
	`url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `episode` (
	`id` text PRIMARY KEY NOT NULL,
	`anime_id` text NOT NULL,
	`episode_number` integer NOT NULL,
	`title` text NOT NULL,
	`test` text
);
--> statement-breakpoint
CREATE TABLE `group` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`name` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tag_to_anime` (
	`tag` text NOT NULL,
	`anime_id` text NOT NULL,
	PRIMARY KEY(`anime_id`, `tag`),
	FOREIGN KEY (`tag`) REFERENCES `tag`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`anime_id`) REFERENCES `anime`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`age` integer,
	`email` text NOT NULL,
	`login` text NOT NULL,
	`password_hash` text NOT NULL,
	`admin` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `user_to_group` (
	`user_id` text NOT NULL,
	`group_id` text NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`group_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `video` (
	`id` text PRIMARY KEY NOT NULL,
	`episode_id` text NOT NULL,
	`url` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `anime_id_unique` ON `anime` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `anime_title_unique` ON `anime` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `download_id_unique` ON `download` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `download_url_unique` ON `download` (`url`);--> statement-breakpoint
CREATE UNIQUE INDEX `episode_id_unique` ON `episode` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `episode_anime_id_episode_number_unique` ON `episode` (`anime_id`,`episode_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `group_id_unique` ON `group` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `group_name_unique` ON `group` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_id_unique` ON `session` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_unique` ON `user` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_login_unique` ON `user` (`login`);--> statement-breakpoint
CREATE UNIQUE INDEX `video_id_unique` ON `video` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `video_url_unique` ON `video` (`url`);