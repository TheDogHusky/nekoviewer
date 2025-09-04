CREATE TABLE `mangas` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`author` text,
	`cover` text,
	`genres` text,
	`volumes` text,
	`display_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`general` text,
	`library` text,
	`accessibility` text,
	`appearance` text,
	`miscellaneous` text
);
