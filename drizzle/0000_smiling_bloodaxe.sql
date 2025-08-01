CREATE TABLE `mangas` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`author` text NOT NULL,
	`cover` text NOT NULL,
	`genres` text,
	`volumes` text
);
