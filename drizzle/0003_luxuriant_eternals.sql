DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `notifications` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 15:34:36.710';--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 15:34:36.709';--> statement-breakpoint
ALTER TABLE `reports` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 15:34:36.710';--> statement-breakpoint
ALTER TABLE `support_messages` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 15:34:36.710';--> statement-breakpoint
ALTER TABLE `support_tickets` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 15:34:36.710';--> statement-breakpoint
ALTER TABLE `support_tickets` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-05-18 15:34:36.710';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 15:34:36.708';