// db/schema.ts
import { mysqlTable, int, varchar, datetime, float, boolean, text, json } from 'drizzle-orm/mysql-core';

// 1. Таблица ролей (отдельная сущность)
export const userRoles = mysqlTable('user_roles', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 50 }).notNull().unique(), // 'client', 'employee', 'admin'
  description: varchar('description', { length: 255 }),
});

// 2. Таблица пользователей (основная сущность)
export const usersTable = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  roleId: int('role_id').references(() => userRoles.id).default(1).notNull(),
  // isVerified: boolean('is_verified').default(false),
  // verificationToken: varchar('verification_token', { length: 255 }),
  // resetToken: varchar('reset_token', { length: 255 }),
  // resetTokenExpiry: datetime('reset_token_expiry'),
  createdAt: datetime('created_at').default(new Date()).notNull(),
  avatar: varchar('avatar', { length: 255 }),
});

// 3. Таблица статусов работников
export const employeeStatuses = mysqlTable('employee_statuses', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 20 }).notNull().unique(), // 'active', 'vacation', 'fired'
  description: varchar('description', { length: 255 }),
});

// 4. Профили работников (расширение users)
export const employeeProfiles = mysqlTable('employee_profiles', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => usersTable.id).unique().notNull(),
  hireDate: datetime('hire_date').notNull(),
  salary: float('salary'),
  skills: json('skills'), // Нормализовали бы, но для простоты оставим JSON
  rating: float('rating').default(0),
  completedOrders: int('completed_orders').default(0),
  statusId: int('status_id').references(() => employeeStatuses.id).default(1),
});

// 5. Таблица типов недвижимости
export const propertyTypes = mysqlTable('property_types', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 20 }).notNull().unique(), // 'APARTMENT', 'OFFICE', 'COTTAGE'
  description: varchar('description', { length: 255 }),
});

// 6. Таблица статусов заказов
export const orderStatuses = mysqlTable('order_statuses', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 20 }).notNull().unique(), // 'pending', 'assigned', etc.
  description: varchar('description', { length: 255 }),
});

// 7. Таблица статусов оплаты
export const paymentStatuses = mysqlTable('payment_statuses', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 20 }).notNull().unique(), // 'unpaid', 'paid', 'refunded'
  description: varchar('description', { length: 255 }),
});

// 8. Таблица методов оплаты
export const paymentMethods = mysqlTable('payment_methods', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 20 }).notNull().unique(), // 'cash', 'card', 'online'
  description: varchar('description', { length: 255 }),
});

// 9. Таблица категорий услуг
export const serviceCategories = mysqlTable('service_categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 50 }).notNull().unique(), // 'regular', 'additional', 'special'
  description: varchar('description', { length: 255 }),
});

// 10. Таблица услуг (прайс-лист)
export const services = mysqlTable('services', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  pricePerSquare: float('price_per_square'),
  basePrice: float('base_price'),
  categoryId: int('category_id').references(() => serviceCategories.id).notNull(),
  duration: int('duration'), // в минутах
  isActive: boolean('is_active').default(true),
  image_url: varchar('image_url', { length: 255 }),
});

// 11. Таблица заказов (основная сущность)
export const orders = mysqlTable('orders', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => usersTable.id).notNull(),
  employeeId: int('employee_id').references(() => usersTable.id),
  serviceId: int('service_id').references(() => services.id).notNull(),
  propertyTypeId: int('property_type_id').references(() => propertyTypes.id).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  rooms: int('rooms'),
  square: int('square').notNull(),
  totalPrice: float('total_price').notNull(),
  date: datetime('date').notNull(),
  endDate: datetime('end_date'),
  comments: varchar('comments', { length: 500 }),
  statusId: int('status_id').references(() => orderStatuses.id).default(1).notNull(),
  paymentStatusId: int('payment_status_id').references(() => paymentStatuses.id).default(1).notNull(),
  paymentMethodId: int('payment_method_id').references(() => paymentMethods.id),
  createdAt: datetime('created_at').default(new Date()).notNull(),
});

// 12. Таблица статусов тикетов поддержки
export const ticketStatuses = mysqlTable('ticket_statuses', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 20 }).notNull().unique(), // 'open', 'in_progress', 'closed'
  description: varchar('description', { length: 255 }),
});

// 13. Таблица тикетов поддержки
export const supportTickets = mysqlTable('support_tickets', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => usersTable.id).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  statusId: int('status_id').references(() => ticketStatuses.id).default(1).notNull(),
  createdAt: datetime('created_at').default(new Date()).notNull(),
  updatedAt: datetime('updated_at').default(new Date()).notNull(),
});

// 14. Таблица сообщений поддержки
export const supportMessages = mysqlTable('support_messages', {
  id: int('id').primaryKey().autoincrement(),
  ticketId: int('ticket_id').references(() => supportTickets.id).notNull(),
  senderId: int('sender_id').references(() => usersTable.id).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: datetime('created_at').default(new Date()).notNull(),
});

// 15. Таблица типов уведомлений
export const notificationTypes = mysqlTable('notification_types', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 50 }).notNull().unique(), // 'order', 'support', 'system'
  description: varchar('description', { length: 255 }),
});

// 16. Таблица уведомлений
export const notifications = mysqlTable('notifications', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => usersTable.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  typeId: int('type_id').references(() => notificationTypes.id).notNull(),
  relatedId: int('related_id'), // ID связанной сущности
  createdAt: datetime('created_at').default(new Date()).notNull(),
});

// 17. Таблица расписания работников
export const employeeSchedules = mysqlTable('employee_schedules', {
  id: int('id').primaryKey().autoincrement(),
  employeeId: int('employee_id').references(() => usersTable.id).notNull(),
  date: datetime('date').notNull(),
  startTime: varchar('start_time', { length: 5 }).notNull(), // '09:00'
  endTime: varchar('end_time', { length: 5 }).notNull(), // '18:00'
  isAvailable: boolean('is_available').default(true),
});

// // 18. Таблица типов отчетов
// export const reportTypes = mysqlTable('report_types', {
//   id: int('id').primaryKey().autoincrement(),
//   name: varchar('name', { length: 50 }).notNull().unique(), // 'daily', 'monthly', 'custom'
//   description: varchar('description', { length: 255 }),
// });

// // 19. Таблица отчетов
// export const reports = mysqlTable('reports', {
//   id: int('id').primaryKey().autoincrement(),
//   typeId: int('type_id').references(() => reportTypes.id).notNull(),
//   periodStart: datetime('period_start').notNull(),
//   periodEnd: datetime('period_end').notNull(),
//   data: json('data').notNull(),
//   createdAt: datetime('created_at').default(new Date()).notNull(),
//   createdBy: int('created_by').references(() => usersTable.id).notNull(),
// });


// 12. Таблица отзывов
// export const reviews = mysqlTable('reviews', {
//   id: int('id').primaryKey().autoincrement(),
//   orderId: int('order_id').references(() => orders.id).unique().notNull(),
//   userId: int('user_id').references(() => usersTable.id).notNull(),
//   employeeId: int('employee_id').references(() => usersTable.id).notNull(),
//   rating: int('rating').notNull(), // 1-5
//   comment: text('comment'),
//   createdAt: datetime('created_at').default(new Date()).notNull(),
// });