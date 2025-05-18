ALTER TABLE `notifications` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 13:51:19.176';--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 13:51:19.175';--> statement-breakpoint
ALTER TABLE `reports` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 13:51:19.176';--> statement-breakpoint
ALTER TABLE `reviews` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 13:51:19.176';--> statement-breakpoint
ALTER TABLE `support_messages` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 13:51:19.176';--> statement-breakpoint
ALTER TABLE `support_tickets` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 13:51:19.176';--> statement-breakpoint
ALTER TABLE `support_tickets` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-05-17 13:51:19.176';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 13:51:19.174';--> statement-breakpoint
ALTER TABLE `services` ADD `image_url` varchar(255);