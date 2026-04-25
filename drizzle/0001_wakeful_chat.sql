CREATE TABLE `artifacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(128),
	`body` text,
	`fileUrl` text,
	`fileKey` varchar(256),
	`type` enum('writing','music','art') NOT NULL DEFAULT 'writing',
	`lifeSeconds` bigint NOT NULL DEFAULT 604800,
	`purpleShade` int NOT NULL DEFAULT 0,
	`isExpired` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastInteractedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `artifacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `interactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artifactId` int NOT NULL,
	`type` enum('view','quip') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `interactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intimate_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`threadId` int NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`body` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intimate_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intimate_threads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artifactId` int NOT NULL,
	`sessionA` varchar(128) NOT NULL,
	`sessionB` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intimate_threads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artifactId` int NOT NULL,
	`nama` varchar(128),
	`body` text,
	`fileUrl` text,
	`fileKey` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quips_id` PRIMARY KEY(`id`)
);
