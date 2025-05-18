ALTER TABLE `notifications` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 10:23:07.887';--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 10:23:07.886';--> statement-breakpoint
ALTER TABLE `reports` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 10:23:07.887';--> statement-breakpoint
ALTER TABLE `reviews` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 10:23:07.886';--> statement-breakpoint
ALTER TABLE `support_messages` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 10:23:07.886';--> statement-breakpoint
ALTER TABLE `support_tickets` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 10:23:07.886';--> statement-breakpoint
ALTER TABLE `support_tickets` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-05-17 10:23:07.886';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-17 10:23:07.884';