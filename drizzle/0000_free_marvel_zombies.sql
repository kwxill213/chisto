CREATE TABLE `employee_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`hire_date` datetime NOT NULL,
	`salary` float,
	`skills` json,
	`rating` float DEFAULT 0,
	`completed_orders` int DEFAULT 0,
	`status_id` int DEFAULT 1,
	CONSTRAINT `employee_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `employee_profiles_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `employee_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`date` datetime NOT NULL,
	`start_time` varchar(5) NOT NULL,
	`end_time` varchar(5) NOT NULL,
	`is_available` boolean DEFAULT true,
	CONSTRAINT `employee_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employee_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `employee_statuses_id` PRIMARY KEY(`id`),
	CONSTRAINT `employee_statuses_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `notification_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `notification_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_types_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`is_read` boolean DEFAULT false,
	`type_id` int NOT NULL,
	`related_id` int,
	`created_at` datetime NOT NULL DEFAULT '2025-05-17 09:17:14.952',
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `order_statuses_id` PRIMARY KEY(`id`),
	CONSTRAINT `order_statuses_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`employee_id` int,
	`service_id` int NOT NULL,
	`property_type_id` int NOT NULL,
	`address` varchar(255) NOT NULL,
	`rooms` int,
	`square` int NOT NULL,
	`total_price` float NOT NULL,
	`date` datetime NOT NULL,
	`end_date` datetime,
	`comments` varchar(500),
	`status_id` int NOT NULL DEFAULT 1,
	`payment_status_id` int NOT NULL DEFAULT 1,
	`payment_method_id` int,
	`created_at` datetime NOT NULL DEFAULT '2025-05-17 09:17:14.952',
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_methods_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `payment_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `payment_statuses_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_statuses_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `property_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `property_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `property_types_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `report_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `report_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `report_types_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type_id` int NOT NULL,
	`period_start` datetime NOT NULL,
	`period_end` datetime NOT NULL,
	`data` json NOT NULL,
	`created_at` datetime NOT NULL DEFAULT '2025-05-17 09:17:14.953',
	`created_by` int NOT NULL,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`user_id` int NOT NULL,
	`employee_id` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`created_at` datetime NOT NULL DEFAULT '2025-05-17 09:17:14.952',
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `reviews_order_id_unique` UNIQUE(`order_id`)
);
--> statement-breakpoint
CREATE TABLE `service_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `service_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`price_per_square` float,
	`base_price` float,
	`category_id` int NOT NULL,
	`duration` int,
	`is_active` boolean DEFAULT true,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticket_id` int NOT NULL,
	`sender_id` int NOT NULL,
	`message` text NOT NULL,
	`is_read` boolean DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT '2025-05-17 09:17:14.952',
	CONSTRAINT `support_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`status_id` int NOT NULL DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT '2025-05-17 09:17:14.952',
	`updated_at` datetime NOT NULL DEFAULT '2025-05-17 09:17:14.952',
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `ticket_statuses_id` PRIMARY KEY(`id`),
	CONSTRAINT `ticket_statuses_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `user_roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`role_id` int NOT NULL DEFAULT 1,
	`is_verified` boolean DEFAULT false,
	`verification_token` varchar(255),
	`reset_token` varchar(255),
	`reset_token_expiry` datetime,
	`created_at` datetime NOT NULL DEFAULT '2025-05-17 09:17:14.950',
	`avatar` varchar(255),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `employee_profiles` ADD CONSTRAINT `employee_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_profiles` ADD CONSTRAINT `employee_profiles_status_id_employee_statuses_id_fk` FOREIGN KEY (`status_id`) REFERENCES `employee_statuses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_schedules` ADD CONSTRAINT `employee_schedules_employee_id_users_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_type_id_notification_types_id_fk` FOREIGN KEY (`type_id`) REFERENCES `notification_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_employee_id_users_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_property_type_id_property_types_id_fk` FOREIGN KEY (`property_type_id`) REFERENCES `property_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_status_id_order_statuses_id_fk` FOREIGN KEY (`status_id`) REFERENCES `order_statuses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_payment_status_id_payment_statuses_id_fk` FOREIGN KEY (`payment_status_id`) REFERENCES `payment_statuses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_payment_method_id_payment_methods_id_fk` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_type_id_report_types_id_fk` FOREIGN KEY (`type_id`) REFERENCES `report_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_employee_id_users_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_category_id_service_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `service_categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_messages` ADD CONSTRAINT `support_messages_ticket_id_support_tickets_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_messages` ADD CONSTRAINT `support_messages_sender_id_users_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_status_id_ticket_statuses_id_fk` FOREIGN KEY (`status_id`) REFERENCES `ticket_statuses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_user_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `user_roles`(`id`) ON DELETE no action ON UPDATE no action;