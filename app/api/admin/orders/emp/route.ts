import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { orders } from '@/drizzle/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const ordersWithoutEmployee = await db
      .select()
      .from(orders)
      .where(sql`employee_id IS NULL`);

    return NextResponse.json(ordersWithoutEmployee);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка сервера при получении заказов без работника' },
      { status: 500 }
    );
  }
}