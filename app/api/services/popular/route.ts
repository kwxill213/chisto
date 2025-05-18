// app/api/services/popular/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { services, orders } from '@/drizzle/schema';
import { desc, eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const popularServices = await db
      .select({
        id: services.id,
        name: services.name,
        description: services.description,
        pricePerSquare: services.pricePerSquare,
        basePrice: services.basePrice,
        duration: services.duration,
        category: services.categoryId,
        orderCount: sql<number>`count(${orders.id})`.as('orderCount'),
        image_url: services.image_url,
      })
      .from(services)
      .leftJoin(orders, eq(orders.serviceId, services.id))
      .groupBy(services.id)
      .orderBy(desc(sql<number>`count(${orders.id})`))
      .limit(5);

    return NextResponse.json(popularServices);
  } catch (error) {
    console.error('Popular services fetch error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении популярных услуг' },
      { status: 500 }
    );
  }
}