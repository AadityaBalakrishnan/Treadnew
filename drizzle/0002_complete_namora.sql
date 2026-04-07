CREATE TABLE `gymActivities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`activityType` varchar(64) NOT NULL,
	`duration` int NOT NULL,
	`caloriesBurned` int NOT NULL,
	`notes` text,
	`activityDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gymActivities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gymLeaderboards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gymName` varchar(256) NOT NULL,
	`gymCity` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`rank` int NOT NULL,
	`totalWorkouts` int NOT NULL DEFAULT 0,
	`totalCaloriesBurned` int NOT NULL DEFAULT 0,
	`streakDays` int NOT NULL DEFAULT 0,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gymLeaderboards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userFitness` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`gymName` varchar(256) NOT NULL,
	`gymCity` varchar(64) NOT NULL,
	`bio` text,
	`profilePhotoUrl` varchar(512),
	`totalWorkouts` int NOT NULL DEFAULT 0,
	`totalCaloriesBurned` int NOT NULL DEFAULT 0,
	`streakDays` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userFitness_id` PRIMARY KEY(`id`),
	CONSTRAINT `userFitness_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `gymActivities` ADD CONSTRAINT `gymActivities_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gymLeaderboards` ADD CONSTRAINT `gymLeaderboards_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userFitness` ADD CONSTRAINT `userFitness_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;