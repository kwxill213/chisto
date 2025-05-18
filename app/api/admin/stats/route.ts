// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { 
  usersTable, 
  orders, 
} from '@/drizzle/schema';
import { and, eq, gte, lt, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Основные метрики
    const totalRevenue = await db
      .select({ total: sql<number>`sum(${orders.totalPrice})` })
      .from(orders)
      .where(eq(orders.paymentStatusId, 2)); // Оплаченные

    const newClients = await db
      .select({ count: sql<number>`count(*)` })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.roleId, 1), // Клиенты
          gte(usersTable.createdAt, monthStart)
        )
      );

    const activeOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(
        and(
          eq(orders.statusId, 3), // В работе
          gte(orders.date, monthStart)
        )
      );

    const completedOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(
        and(
          eq(orders.statusId, 4), // Завершенные
          gte(orders.date, monthStart)
        )
      );


    // Данные для сравнения с предыдущим месяцем
    const lastMonthRevenue = await db
      .select({ total: sql<number>`sum(${orders.totalPrice})` })
      .from(orders)
      .where(
        and(
          eq(orders.paymentStatusId, 2),
          gte(orders.createdAt, lastMonthStart),
          lt(orders.createdAt, monthStart)
        )
      );

    const lastMonthClients = await db
      .select({ count: sql<number>`count(*)` })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.roleId, 1),
          gte(usersTable.createdAt, lastMonthStart),
          lt(usersTable.createdAt, monthStart)
        )
      );

    // Расчет изменений в процентах
    const revenueChangePercentage = calculatePercentageChange(
      totalRevenue[0].total || 0,
      lastMonthRevenue[0].total || 0
    );

    const clientGrowthPercentage = calculatePercentageChange(
      newClients[0].count,
      lastMonthClients[0].count
    );

    // Дополнительные метрики
    const ordersInProgress = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.statusId, 3));

    const successfulOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(
        and(
          eq(orders.statusId, 4),
          gte(orders.date, monthStart)
        )
      );

    const allMonthOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(gte(orders.date, monthStart));

    const completionRate = allMonthOrders[0].count > 0 
      ? Math.round((successfulOrders[0].count / allMonthOrders[0].count) * 100)
      : 0;

    return NextResponse.json({
      totalRevenue: totalRevenue[0].total || 0,
      newClients: newClients[0].count,
      activeOrders: activeOrders[0].count,
      completedOrders: completedOrders[0].count,
      revenueChangePercentage,
      clientGrowthPercentage,
      ordersInProgress: ordersInProgress[0].count,
      completionRate,
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении статистики' },
      { status: 500 }
    );
  }
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}