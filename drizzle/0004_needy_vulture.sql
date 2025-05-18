ALTER TABLE `notifications` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 17:17:30.438';--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 17:17:30.437';--> statement-breakpoint
ALTER TABLE `support_messages` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 17:17:30.437';--> statement-breakpoint
ALTER TABLE `support_tickets` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 17:17:30.437';--> statement-breakpoint
ALTER TABLE `support_tickets` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-05-18 17:17:30.437';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-18 17:17:30.434';--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `is_verified`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `verification_token`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `reset_token`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `reset_token_expiry`;